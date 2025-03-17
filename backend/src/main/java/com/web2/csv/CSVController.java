package com.web2.csv;

import com.web2.restaurant.RestaurantService;
import com.web2.restaurant.Restaurant;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class CSVController {

    private final CSVService csvService;
    private final RestaurantService restaurantService;

    @PostMapping("/api/admin/upload-csv")
    public ResponseEntity<String> uploadCsv(@RequestParam("file") MultipartFile file) {
        try {
            // CSV 파일 파싱
            List<Restaurant> restaurants = csvService.parseCsvFile(file);
            // 파싱된 데이터 저장
            restaurantService.saveAll(restaurants);
            return ResponseEntity.ok("CSV data uploaded and saved successfully!");
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to process CSV file");
        }
    }
}
