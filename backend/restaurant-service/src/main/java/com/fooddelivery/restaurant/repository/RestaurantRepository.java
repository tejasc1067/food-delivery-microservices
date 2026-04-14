package com.fooddelivery.restaurant.repository;

import com.fooddelivery.restaurant.entity.Restaurant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.util.List;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {

    @Query(value = "SELECT * FROM restaurants r WHERE " +
           "(CAST(:query AS VARCHAR) IS NULL OR LOWER(r.name) LIKE LOWER(CONCAT('%', CAST(:query AS VARCHAR), '%'))) AND " +
           "(CAST(:city AS VARCHAR) IS NULL OR LOWER(r.city) = LOWER(CAST(:city AS VARCHAR))) AND " +
           "(CAST(:rating AS DECIMAL) IS NULL OR r.rating >= CAST(:rating AS DECIMAL)) AND " +
           "(CAST(:cuisine AS VARCHAR) IS NULL OR LOWER(r.cuisine_type) = LOWER(CAST(:cuisine AS VARCHAR)))",
           countQuery = "SELECT COUNT(*) FROM restaurants r WHERE " +
           "(CAST(:query AS VARCHAR) IS NULL OR LOWER(r.name) LIKE LOWER(CONCAT('%', CAST(:query AS VARCHAR), '%'))) AND " +
           "(CAST(:city AS VARCHAR) IS NULL OR LOWER(r.city) = LOWER(CAST(:city AS VARCHAR))) AND " +
           "(CAST(:rating AS DECIMAL) IS NULL OR r.rating >= CAST(:rating AS DECIMAL)) AND " +
           "(CAST(:cuisine AS VARCHAR) IS NULL OR LOWER(r.cuisine_type) = LOWER(CAST(:cuisine AS VARCHAR)))",
           nativeQuery = true)
    Page<Restaurant> search(@Param("query") String query,
                            @Param("city") String city,
                            @Param("rating") BigDecimal rating,
                            @Param("cuisine") String cuisine,
                            Pageable pageable);
}
