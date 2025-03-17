package com.web2.global.s3;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;
import java.util.UUID;

@Service
public class S3Service {

    private final AmazonS3 amazonS3;
    private final String bucket;

    public S3Service(AmazonS3 amazonS3, @Value("${cloud.aws.s3.bucket}") String bucket) {
        this.amazonS3 = amazonS3;
        this.bucket = bucket;
    }

    public String uploadFileFromUrl(String photoUrl) throws IOException {
        try {
            //Google Places API로부터 받아온 이미지 URL
            URL url = new URL(photoUrl);
            InputStream inputStream = url.openStream();
/*
            String fileName = UUID.randomUUID().toString() + ".jpg"; // 확장자는 필요에 따라 수정
*/
            // InputStream을 byte 배열로 변환
            ByteArrayOutputStream buffer = new ByteArrayOutputStream();
            byte[] data = new byte[8192];
            int bytesRead;

            while ((bytesRead = inputStream.read(data, 0, data.length)) != -1) {
                buffer.write(data, 0, bytesRead);
            }

            byte[] imageBytes = buffer.toByteArray();
            ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(imageBytes);

            // S3에 업로드할 파일 메타데이터 설정
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(imageBytes.length); // 실제 파일 크기 설정

            // Content-Type 자동 감지
            String contentType = URLConnection.guessContentTypeFromStream(byteArrayInputStream);
            if (contentType == null) contentType = "image/jpeg"; // 기본값 설정
            metadata.setContentType(contentType);

            // UUID로 파일명 생성 (확장자는 jpg로 저장)
            String fileName = UUID.randomUUID() + ".jpg";

            // S3에 파일 업로드
            amazonS3.putObject(new PutObjectRequest(bucket, fileName, byteArrayInputStream, metadata)
                    .withCannedAcl(CannedAccessControlList.PublicRead));
            // 업로드된 파일의 S3 URL 반환
            return amazonS3.getUrl(bucket, fileName).toString();

        } catch (IOException e) {
            throw new RuntimeException("S3 업로드 실패", e);
        }
    }

    public void deleteFileFromS3Bucket(String fileUrl) {
        String fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1); // URL에서 파일명 추출

        try {
            amazonS3.deleteObject(new DeleteObjectRequest(bucket, fileName));
        } catch (AmazonServiceException e) {
            // 예외 처리
            System.err.println("S3 파일 삭제 오류: " + e.getErrorMessage());
        }
    }
}
