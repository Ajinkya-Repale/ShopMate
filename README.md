# ShopMate

A full-stack e-commerce website with a public storefront and a secured admin panel for managing products, users, coupons, and returns. Built with React on the frontend and Spring Boot on the backend, backed by MongoDB.

Live site: https://shop-mate-gamma.vercel.app/

## Features

- Storefront — Hero, Categories, Collections, Deals, Brands, Discover, product search, product detail modal with reviews
- Cart, checkout/order flow, and order history
- Wishlist
- Auth — signup/login with JWT, saved addresses, profile page
- Coupons applied at checkout
- Return requests raised by customers
- Admin panel — secured with JWT, manage products, users, coupons, and returns, upload product images to Cloudinary
- Light/dark theme toggle
- About and Contact pages

## Tech Stack

**Frontend**
- React 19 + Vite
- Plain CSS (component-scoped stylesheets)
- Fetch-based API client (no axios)
- State-based page routing (no react-router)

**Backend**
- Java 17 + Spring Boot 3.5
- Spring Security + JWT (jjwt) for auth
- Spring Data MongoDB
- Cloudinary (image storage)
- Lombok

**Deployment**
- Frontend: Vercel
- Backend: Docker-ready (Dockerfile included)
- Database: MongoDB Atlas

## Project Structure

```
ShopMate-main/
├── src/
│   ├── User/
│   │   ├── AboutPage.jsx
│   │   ├── AuthPages.css
│   │   ├── BrandsPage.jsx
│   │   ├── CartPage.jsx
│   │   ├── Categories.jsx
│   │   ├── CollectionsPage.jsx
│   │   ├── ContactPage.jsx
│   │   ├── DealsPage.jsx
│   │   ├── DiscoverPage.jsx
│   │   ├── Footer.jsx
│   │   ├── Hero.jsx
│   │   ├── LoginPage.jsx
│   │   ├── Memberstrip.jsx
│   │   ├── MyOrdersPage.jsx
│   │   ├── Navbar.jsx
│   │   ├── Productdetailmodal.jsx
│   │   ├── Products.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── Reviews.jsx
│   │   ├── SignupPage.jsx
│   │   ├── Variables.css
│   │   └── api.js
│   ├── Admin/
│   │   ├── AdminApp.jsx
│   │   └── AdminDashboard.jsx
│   ├── assets/
│   ├── App.jsx
│   ├── WakeUpSplash.jsx
│   └── main.jsx
├── public/
├── vercel.json
├── vite.config.js
└── package.json

Shopmate-backend-main/
├── src/main/java/com/example/demo/
│   ├── controller/
│   │   ├── AdminProductController.java
│   │   ├── AdminUserController.java
│   │   ├── AuthController.java
│   │   ├── CartController.java
│   │   ├── CouponController.java
│   │   ├── ImageUploadController.java
│   │   ├── OrderController.java
│   │   ├── ProductController.java
│   │   ├── ReturnRequestController.java
│   │   ├── ReviewController.java
│   │   ├── UserController.java
│   │   └── WishlistController.java
│   ├── service/
│   │   ├── AuthService.java
│   │   ├── CartService.java
│   │   ├── CouponService.java
│   │   ├── OrderService.java
│   │   ├── ProductService.java
│   │   ├── ReturnRequestService.java
│   │   ├── ReviewService.java
│   │   └── WishlistService.java
│   ├── repository/
│   │   ├── AdminRepository.java
│   │   ├── CartRepository.java
│   │   ├── CouponRepository.java
│   │   ├── OrderRepository.java
│   │   ├── ProductRepository.java
│   │   ├── ReturnRequestRepository.java
│   │   ├── ReviewRepository.java
│   │   ├── UserRepository.java
│   │   └── WishlistRepository.java
│   ├── entity/
│   │   ├── Address.java
│   │   ├── Admin.java
│   │   ├── Cart.java
│   │   ├── CartItem.java
│   │   ├── Coupon.java
│   │   ├── Order.java
│   │   ├── OrderItem.java
│   │   ├── Product.java
│   │   ├── ReturnRequest.java
│   │   ├── Review.java
│   │   ├── User.java
│   │   └── Wishlist.java
│   ├── dto/
│   │   ├── ApiResponse.java
│   │   ├── AuthResponse.java
│   │   ├── CouponRequest.java
│   │   ├── LoginRequest.java
│   │   ├── OrderRequest.java
│   │   ├── ProductRequest.java
│   │   ├── RegisterRequest.java
│   │   ├── ReturnRequestDto.java
│   │   └── ReturnStatusRequest.java
│   ├── security/
│   │   ├── JwtFilter.java
│   │   ├── JwtUtil.java
│   │   └── UserDetailsServiceImpl.java
│   ├── config/
│   │   ├── CorsConfig.java
│   │   ├── SecurityConfig.java
│   │   └── WebConfig.java
│   └── ShopMateBackendApplication.java
├── src/main/resources/application.properties
├── Dockerfile
└── pom.xml
```

## Author

Ajinkya Repale
Java Developer

## Contact

Feel free to reach out for collaborations, opportunities, or just to say hi.

- Email: ajinkyarepale45@gmail.com
- GitHub: [github.com/Ajinkya-Repale](https://github.com/Ajinkya-Repale)
