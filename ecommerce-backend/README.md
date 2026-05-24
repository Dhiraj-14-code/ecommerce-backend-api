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
