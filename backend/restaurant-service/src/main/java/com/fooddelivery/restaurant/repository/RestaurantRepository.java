package com.fooddelivery.restaurant.repository;

import com.fooddelivery.restaurant.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.util.List;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {

    @Query("SELECT r FROM Restaurant r WHERE " +
           "(:query IS NULL OR LOWER(r.name) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:city IS NULL OR LOWER(r.city) = LOWER(:city)) AND " +
           "(:rating IS NULL OR r.rating >= :rating) AND " +
           "(:cuisine IS NULL OR LOWER(r.cuisineType) = LOWER(:cuisine))")
    List<Restaurant> search(@Param("query") String query,
                            @Param("city") String city,
                            @Param("rating") BigDecimal rating,
                            @Param("cuisine") String cuisine);
}
