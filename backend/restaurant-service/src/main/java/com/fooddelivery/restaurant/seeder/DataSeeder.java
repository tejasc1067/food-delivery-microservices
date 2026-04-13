package com.fooddelivery.restaurant.seeder;

import com.fooddelivery.restaurant.entity.MenuItem;
import com.fooddelivery.restaurant.entity.Restaurant;
import com.fooddelivery.restaurant.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final RestaurantRepository restaurantRepository;
    
    private static final String[] CITIES = {
        "Mumbai", "Pune", "Nashik", "Nagpur", "Pandharpur", 
        "Sangli", "Kolhapur", "Satara", "Latur", "Nanded"
    };

    private static final String[] ADJS = {
        "Golden", "Spicy", "Royal", "Tasty", "Classic", "Modern", "Grand", "Secret",
        "Famous", "Authentic", "Premium", "Fresh", "Green", "Red", "Blue", "Silver",
        "Happy", "Maha", "Shahi", "Desi"
    };

    private static final String[] NOUNS = {
        "Kitchen", "Diner", "Palace", "Bowl", "House", "Garden", "Spoon", "Plate",
        "Corner", "Street", "Bites", "Express", "Cafe", "Bistro", "Treats", "Point",
        "Joint", "Hub", "Oven", "Grill"
    };

    private static final String[] CUISINES = {
        "Maharashtrian", "North Indian", "South Indian", "Chinese", "Italian", 
        "Continental", "Street Food", "Desserts", "Beverages", "Fast Food"
    };

    private static final String[] DISH_PREFIXES = {
        "Special", "Spicy", "Classic", "Premium", "Homestyle", "Crispy", "Tandoori", "Buttery", "Sweet"
    };

    private static final String[] DISH_NAMES = {
        "Misal Pav", "Vada Pav", "Pav Bhaji", "Puran Poli", "Thali", "Biryani", 
        "Paneer Masala", "Dal Makhani", "Masala Dosa", "Hakka Noodles", 
        "Manchurian", "Margherita Pizza", "Pasta", "Burger", "Sandwich", 
        "Samosa", "Jalebi", "Gulab Jamun", "Lassi", "Cold Coffee"
    };

    private static final String[] IMAGES = {
        "https://www.themealdb.com/images/media/meals/rg9ze01763479093.jpg",
        "https://www.themealdb.com/images/media/meals/se5vhk1764114880.jpg",
        "https://www.themealdb.com/images/media/meals/as88dq1762772486.jpg",
        "https://www.themealdb.com/images/media/meals/tvvxpv1511191952.jpg",
        "https://www.themealdb.com/images/media/meals/uwvxpv1511557015.jpg",
        "https://www.themealdb.com/images/media/meals/q47rkb1762324620.jpg",
        "https://www.themealdb.com/images/media/meals/hyk47c1762772689.jpg",
        "https://www.themealdb.com/images/media/meals/72fgzj1764109947.jpg",
        "https://www.themealdb.com/images/media/meals/xrptpq1483909204.jpg",
        "https://www.themealdb.com/images/media/meals/p9tebp1764118792.jpg",
        "https://www.themealdb.com/images/media/meals/8b2msz1763074897.jpg",
        "https://www.themealdb.com/images/media/meals/wkhg581762773124.jpg",
        "https://www.themealdb.com/images/media/meals/fpl3mv1766433431.jpg",
        "https://www.themealdb.com/images/media/meals/pkyvrn1764878267.jpg",
        "https://www.themealdb.com/images/media/meals/qxytrx1511304021.jpg",
        "https://www.themealdb.com/images/media/meals/xihv0c1764447887.jpg",
        "https://www.themealdb.com/images/media/meals/yypvst1511386427.jpg",
        "https://www.themealdb.com/images/media/meals/7b862e1763194846.jpg",
        "https://www.themealdb.com/images/media/meals/f3ee3y1763309332.jpg",
        "https://www.themealdb.com/images/media/meals/hblwvg1763478203.jpg",
        "https://www.themealdb.com/images/media/meals/sytuqu1511553755.jpg",
        "https://www.themealdb.com/images/media/meals/lmc6r51764365554.jpg",
        "https://www.themealdb.com/images/media/meals/j9nray1765657692.jpg",
        "https://www.themealdb.com/images/media/meals/prjve31763486864.jpg",
        "https://www.themealdb.com/images/media/meals/t8mn9g1560460231.jpg",
        "https://www.themealdb.com/images/media/meals/sxysrt1468240488.jpg",
        "https://www.themealdb.com/images/media/meals/58oia61564916529.jpg",
        "https://www.themealdb.com/images/media/meals/d8f6qx1604182128.jpg",
        "https://www.themealdb.com/images/media/meals/4o4wh11761848573.jpg",
        "https://www.themealdb.com/images/media/meals/vptwyt1511450962.jpg",
        "https://www.themealdb.com/images/media/meals/oal8x31764119345.jpg",
        "https://www.themealdb.com/images/media/meals/wpkfin1763597958.jpg",
        "https://www.themealdb.com/images/media/meals/gqlxgc1764368767.jpg",
        "https://www.themealdb.com/images/media/meals/2wx8cm1763373419.jpg",
        "https://www.themealdb.com/images/media/meals/6cskio1763338156.jpg",
        "https://www.themealdb.com/images/media/meals/bx07m71764792853.jpg",
        "https://www.themealdb.com/images/media/meals/crd1jz1763592990.jpg",
        "https://www.themealdb.com/images/media/meals/u5e9qq1763795441.jpg",
        "https://www.themealdb.com/images/media/meals/xj9sa81764788866.jpg",
        "https://www.themealdb.com/images/media/meals/cj56fs1762340001.jpg",
        "https://www.themealdb.com/images/media/meals/gkcdpl1764441325.jpg",
        "https://www.themealdb.com/images/media/meals/s73ytv1765567838.jpg",
        "https://www.themealdb.com/images/media/meals/rjhf741585564676.jpg",
        "https://www.themealdb.com/images/media/meals/vtqxtu1511784197.jpg",
        "https://www.themealdb.com/images/media/meals/usywpp1511189717.jpg",
        "https://www.themealdb.com/images/media/meals/1550440197.jpg",
        "https://www.themealdb.com/images/media/meals/w8umt11583268117.jpg",
        "https://www.themealdb.com/images/media/meals/x372ug1598733932.jpg",
        "https://www.themealdb.com/images/media/meals/hyarod1565090529.jpg",
        "https://www.themealdb.com/images/media/meals/qstyvs1505931190.jpg",
        "https://www.themealdb.com/images/media/meals/tqrrsq1511723764.jpg",
        "https://www.themealdb.com/images/media/meals/uuuspp1511297945.jpg",
        "https://www.themealdb.com/images/media/meals/yx8j1i1763484612.jpg",
        "https://www.themealdb.com/images/media/meals/1brbso1763585098.jpg",
        "https://www.themealdb.com/images/media/meals/4mhr3u1763481087.jpg",
        "https://www.themealdb.com/images/media/meals/rvypwy1503069308.jpg",
        "https://www.themealdb.com/images/media/meals/4yjart1763248459.jpg",
        "https://www.themealdb.com/images/media/meals/xutquv1505330523.jpg",
        "https://www.themealdb.com/images/media/meals/sywswr1511383814.jpg",
        "https://www.themealdb.com/images/media/meals/u55lbp1585564013.jpg",
        "https://www.themealdb.com/images/media/meals/pkopc31683207947.jpg",
        "https://www.themealdb.com/images/media/meals/qwrtut1468418027.jpg",
        "https://www.themealdb.com/images/media/meals/uttuxy1511382180.jpg",
        "https://www.themealdb.com/images/media/meals/qtuuys1511387068.jpg",
        "https://www.themealdb.com/images/media/meals/ypxvwv1505333929.jpg",
        "https://www.themealdb.com/images/media/meals/ussyxw1515364536.jpg",
        "https://www.themealdb.com/images/media/meals/1529445893.jpg",
        "https://www.themealdb.com/images/media/meals/e8ihjp1764123021.jpg",
        "https://www.themealdb.com/images/media/meals/el64dy1763483009.jpg",
        "https://www.themealdb.com/images/media/meals/qxuqtt1511724269.jpg",
        "https://www.themealdb.com/images/media/meals/jyjlhj1763075323.jpg",
        "https://www.themealdb.com/images/media/meals/qrqywr1503066605.jpg",
        "https://www.themealdb.com/images/media/meals/swo87v1763595282.jpg",
        "https://www.themealdb.com/images/media/meals/9r2xrg1763771238.jpg",
        "https://www.themealdb.com/images/media/meals/wrustq1511475474.jpg",
        "https://www.themealdb.com/images/media/meals/paejva1765321314.jpg",
        "https://www.themealdb.com/images/media/meals/yyrrxr1511816289.jpg",
        "https://www.themealdb.com/images/media/meals/z1hz7z1765316430.jpg",
        "https://www.themealdb.com/images/media/meals/118oj61763423896.jpg",
        "https://www.themealdb.com/images/media/meals/urtwux1486983078.jpg",
        "https://www.themealdb.com/images/media/meals/n1hcou1628770088.jpg",
        "https://www.themealdb.com/images/media/meals/xwutvy1511555540.jpg",
        "https://www.themealdb.com/images/media/meals/ytpstt1511814614.jpg",
        "https://www.themealdb.com/images/media/meals/g046bb1663960946.jpg",
        "https://www.themealdb.com/images/media/meals/wxyvqq1511723401.jpg",
        "https://www.themealdb.com/images/media/meals/uwxqwy1483389553.jpg",
        "https://www.themealdb.com/images/media/meals/lwsnkl1604181187.jpg",
        "https://www.themealdb.com/images/media/meals/a4kgf21763075288.jpg",
        "https://www.themealdb.com/images/media/meals/fk80jp1763280767.jpg",
        "https://www.themealdb.com/images/media/meals/dlmh401760524897.jpg",
        "https://www.themealdb.com/images/media/meals/uttupv1511815050.jpg",
        "https://www.themealdb.com/images/media/meals/wuvryu1468232995.jpg",
        "https://www.themealdb.com/images/media/meals/jyylmo1763790808.jpg"
    };

    private int imgIdx = 0;
    private final Random random = new Random(42); // specific seed for pseudo-consistency

    @Override
    @Transactional
    public void run(String... args) {
        if (restaurantRepository.count() > 0) {
            log.info("Data already seeded, skipping...");
            return;
        }

        log.info("Seeding data for 10 cities, 100 restaurants each, 9 items per restaurant...");
        
        long startTime = System.currentTimeMillis();

        for (String city : CITIES) {
            List<Restaurant> cityRestaurants = new ArrayList<>(100);
            
            for (int i = 0; i < 100; i++) {
                String name = ADJS[random.nextInt(ADJS.length)] + " " + NOUNS[random.nextInt(NOUNS.length)];
                if (i % 5 == 0) {
                    name += " " + (i + 1); // Ensures variety
                }
                
                String cuisine = CUISINES[random.nextInt(CUISINES.length)];
                double rawRating = 3.5 + (random.nextDouble() * 1.4); // Rating 3.5 to 4.9
                BigDecimal rating = new BigDecimal(rawRating).setScale(1, RoundingMode.HALF_UP);
                
                Restaurant restaurant = Restaurant.builder()
                        .name(name)
                        .description("Serving the best " + cuisine + " in " + city)
                        .address(random.nextInt(100) + ", Main Street")
                        .city(city)
                        .cuisineType(cuisine)
                        .rating(rating)
                        .imageUrl(IMAGES[imgIdx++ % IMAGES.length])
                        .build();

                List<MenuItem> menuItems = new ArrayList<>(9);
                for (int j = 0; j < 9; j++) {
                    String itemName = DISH_PREFIXES[random.nextInt(DISH_PREFIXES.length)] + " " + DISH_NAMES[random.nextInt(DISH_NAMES.length)];
                    double rawPrice = 100 + (random.nextDouble() * 400); // 100 to 500
                    BigDecimal price = new BigDecimal(rawPrice).setScale(0, RoundingMode.HALF_UP);
                    
                    menuItems.add(MenuItem.builder()
                            .name(itemName)
                            .description("Chef's special " + itemName.toLowerCase() + " cooked with fresh ingredients.")
                            .price(price)
                            .imageUrl(IMAGES[imgIdx++ % IMAGES.length])
                            .category("Main Course")
                            .isAvailable(true)
                            .restaurant(restaurant)
                            .build());
                }
                
                restaurant.setMenuItems(menuItems);
                cityRestaurants.add(restaurant);
            }
            
            restaurantRepository.saveAll(cityRestaurants);
            log.info("Seeded 100 restaurants for city: {}", city);
        }

        long timeTaken = System.currentTimeMillis() - startTime;
        log.info("Successfully seeded all cities in {}ms!", timeTaken);
    }
}
