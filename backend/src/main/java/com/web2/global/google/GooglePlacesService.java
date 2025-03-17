package com.web2.global.google;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class GooglePlacesService {

    @Value("${google.api.key}")
    private String GOOGLE_API_KEY;
    private static final String PLACES_SEARCH_URL = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json";
    private static final String PLACE_PHOTO_URL = "https://maps.googleapis.com/maps/api/place/photo";

    // 장소 검색 및 photoReference 가져오기
    public String getPhotoReference(String restaurantName, String address) {
        try {
            String url = PLACES_SEARCH_URL + "?input=" + restaurantName + " " + address + " "
                         + "&inputtype=textquery&fields=photos&key=" + GOOGLE_API_KEY;
            /*String url = UriComponentsBuilder.fromHttpUrl(PLACES_SEARCH_URL)
                    .queryParam("input", restaurantName)
                    .queryParam("inputtype", "textquery")
                    .queryParam("fields", "photos,place_id")
                    .queryParam("locationbias", "circle:5000@" + address)
                    .queryParam("key", GOOGLE_API_KEY)
                    .toUriString();*/

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            JSONObject jsonResponse = new JSONObject(response.getBody());

            if (jsonResponse.has("candidates") && !jsonResponse.getJSONArray("candidates").isEmpty()) {
                JSONObject candidate = jsonResponse.getJSONArray("candidates").getJSONObject(0);
                if (candidate.has("photos")) {
                    return candidate.getJSONArray("photos").getJSONObject(0).getString("photo_reference");
                }
            }

            /*if(response.getStatusCode().is2xxSuccessful()) {

                if (jsonResponse.has("candidates") && !jsonResponse.getJSONArray("candidates").isEmpty()) {
                    JSONObject candidate = jsonResponse.getJSONArray("candidates").getJSONObject(0);
                    if (candidate.has("photos")) {
                        return candidate.getJSONArray("photos").getJSONObject(0).getString("photo_reference");
                    }
                }
            }*/
        } catch (Exception e) {
            System.out.println("Google Places API 오류: " + e.getMessage());
        }
        return null;
    }

    // photoReference로 이미지 URL 생성
    public String getPhotoUrl(String photoReference) {
        if(photoReference == null) {
            return null;
        }

        return UriComponentsBuilder.fromHttpUrl(PLACE_PHOTO_URL)
                .queryParam("maxwidth", 800)
                .queryParam("photoreference", photoReference)
                .queryParam("key", GOOGLE_API_KEY)
                .toUriString();
    }
}

