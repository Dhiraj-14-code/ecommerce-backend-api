````md
# 🛒 Ecommerce Backend API

A backend Ecommerce REST API project built using Spring Boot.  
This project demonstrates real-world backend development concepts
like CRUD operations, layered architecture, DTO mapping, pagination,
sorting, filtering, search APIs, exception handling, and entity relationships.

---

# 🚀 Features

## ✅ Product Management
- Create Product
- Bulk Create Products
- CSV / JSON Dataset Import
- Get All Products
- Get Product By ID
- Update Product
- Delete Product

---

## ✅ Category Management
- Create Category
- Get All Categories
- Get Category By ID
- Update Category
- Delete Category

---

## ✅ Product Features
- Pagination
- Dynamic Sorting
- Search Products By Name
- Filter Products By Price Range

---

## ✅ Backend Architecture
- Layered Architecture
- DTO Pattern
- Service Layer
- Repository Layer
- Global Exception Handling
- Validation Handling

---

# 🛠 Technologies Used

- Java
- Spring Boot
- Spring Data JPA
- Hibernate
- MySQL
- Maven
- Lombok
- Git
- GitHub

---

# 📂 Project Structure

```text
src/main/java/com/dhiraj/ecommerce
│
├── controller
│
├── service
│
├── repository
│
├── entity
│
├── dto
│
├── exception
│
└── config
````

---

# 🗄 Database

Database used:

```text
MySQL
```

---

# ⚙️ API Endpoints

# 📦 Product APIs

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| POST   | `/api/products`      | Create Product    |
| POST   | `/api/products/bulk` | Bulk Create Products from JSON array |
| POST   | `/api/products/upload-csv` | Upload Products from CSV file |
| POST   | `/api/products/upload-dataset` | Auto-detect and import CSV datasets |
| GET    | `/api/products`      | Get All Products  |
| GET    | `/api/products/{id}` | Get Product By ID |
| PUT    | `/api/products/{id}` | Update Product    |
| DELETE | `/api/products/{id}` | Delete Product    |

---

# 🔍 Product Search & Filter APIs

| Method | Endpoint                                 |
| ------ | ---------------------------------------- |
| GET    | `/api/products/search?name=laptop`       |
| GET    | `/api/products/filter?min=1000&max=5000` |

---

# 📄 Pagination & Sorting Example

```http
GET /api/products?page=0&size=5&sortBy=price&sortDir=desc
```

---

# 🏷 Category APIs

| Method | Endpoint               |
| ------ | ---------------------- |
| POST   | `/api/categories`      |
| GET    | `/api/categories`      |
| GET    | `/api/categories/{id}` |
| PUT    | `/api/categories/{id}` |
| DELETE | `/api/categories/{id}` |

---

# 🧠 Concepts Learned

* REST API Development
* DTO Mapping
* Entity Relationships
* Pagination & Sorting
* Search & Filtering APIs
* Exception Handling
* Clean Code Refactoring
* Git & GitHub Workflow

---

# 🔮 Future Improvements

* JWT Authentication
* User & Role Management
* Cart Module
* Order Management
* Swagger Documentation
* Docker Support
* Deployment

---

# 👨‍💻 Author

**Dhiraj Gupta**

GitHub:
[https://github.com/Dhiraj-14-code](https://github.com/Dhiraj-14-code)

```
```
