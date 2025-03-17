package com.web2.csv;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;
import com.web2.restaurant.Restaurant;
import com.web2.restaurant.RestaurantRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class CSVService {

    private final RestaurantRepository restaurantRepository;

    public CSVService(RestaurantRepository restaurantRepository) {
        this.restaurantRepository = restaurantRepository;
    }

    private boolean isNumeric(String str) {
        if (str == null || str.trim().isEmpty()) {
            return false;
        }
        try {
            Double.parseDouble(str.trim());  // 공백 제거 후 숫자 변환 시도
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    public List<Restaurant> parseCsvFile(MultipartFile file) throws IOException {
        List<Restaurant> restaurants = new ArrayList<>();

        try (CSVReader reader = new CSVReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            String[] line;
            int rowNumber = 0;  // 추가: 행 번호를 기록하여 문제 발생 시 로그 남기기

            while ((line = reader.readNext()) != null) {
                rowNumber++;  // 현재 행 번호 증가

                if (line[0].equals("시설명")) {
                    continue; // Skip header
                }

                try {
                    Restaurant restaurant = new Restaurant();

                    restaurant.setName(line[0]);
                    restaurant.setCategory(line[3]);
                    restaurant.setCity(line[4]); // 시도 명칭

                    // 위도 및 경도 유효성 검사 후 설정
                    try {
                        String latitudeStr = line[11].trim(); // 공백 제거
                        String longitudeStr = line[12].trim();

                        if (!isNumeric(latitudeStr) || !isNumeric(longitudeStr)) {
                            System.out.println("Invalid latitude or longitude in line " + rowNumber + ": " + Arrays.toString(line));
                            continue;  // 이 행을 무시
                        } else {
                            restaurant.setLatitude(Double.parseDouble(latitudeStr));
                            restaurant.setLongitude(Double.parseDouble(longitudeStr));
                        }
                    } catch (NumberFormatException e) {
                        System.out.println("Failed to parse latitude or longitude in line " + rowNumber + ": " + Arrays.toString(line));
                        continue;  // 잘못된 값인 경우 해당 행을 무시
                    }

                    restaurant.setAddress(line[14]); // 주소 컬럼
                    restaurant.setWeekdays(line[17]);
                    restaurant.setWeekend(line[18]);
                    restaurant.setVegetarian("채식 메뉴 있음".equals(line[24]));
                    restaurant.setHalal("할랄음식 메뉴 있음".equals(line[25]));
                    restaurant.setGlutenfree("글루텐프리 메뉴 있음".equals(line[26]));

                    restaurants.add(restaurant);

                } catch (Exception e) {
                    System.out.println("Error processing line " + rowNumber + ": " + e.getMessage());
                }
            }
        } catch (IOException | CsvValidationException e) {
            e.printStackTrace();
        }
        return restaurantRepository.saveAll(restaurants);
    }
}
