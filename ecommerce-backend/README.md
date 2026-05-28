# Ecommerce Backend API

Spring Boot ecommerce backend with JWT auth, role-based access, cart, and order flow.

## Tech Stack
- Java 21
- Spring Boot
- Spring Security + JWT
- Spring Data JPA
- MySQL
- Maven

## Run
1. Update DB credentials in `src/main/resources/application.properties`.
2. Start app:
   - Windows: `./mvnw.cmd spring-boot:run`

## Default Seeded Admin
Seeded on startup (if not already present):
- Email: `admin@test.com`
- Password: `admin123`

## Roles
- `USER`: read products/categories, cart actions, place/view own orders
- `ADMIN`: all USER access + create/update/delete products/categories

## API Flow (Postman)
1. Register user:
   - `POST /api/auth/register`
2. Login:
   - `POST /api/auth/login`
   - copy token
3. Add auth header:
   - `Authorization: Bearer <token>`
4. Browse products:
   - `GET /api/products?page=0&size=5&sortBy=id&sortDir=asc`
5. Cart:
   - `POST /api/cart/items`
   - `GET /api/cart`
   - `PUT /api/cart/items/{itemId}`
   - `DELETE /api/cart/items/{itemId}`
6. Order:
   - `POST /api/orders` (places order from cart + deducts stock)
   - `GET /api/orders`

## Response Notes
- Create endpoints return `201 Created`.
- Validation and API errors follow standard shape:
  - `timestamp`
  - `status`
  - `message`
  - `path`
  - `errors` (validation only)

## Quick Deployment
The simplest free setup is Railway:
1. Push this repo to GitHub.
2. Create a Railway project.
3. Add a MySQL database service.
4. Deploy the Spring Boot app from the same repo.
5. Set `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`, and `JWT_SECRET` in the app service.

The app now reads the database URL and port from environment variables, so it works without changing code again.
