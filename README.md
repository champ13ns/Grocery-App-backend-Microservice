# Grocery App Backend - Microservice Architecture

This repository contains the backend of a grocery application designed using a microservice architecture. The system is composed of four distinct microservices, each responsible for specific functionalities within the application. The microservices communicate with each other via RabbitMQ, a message broker that facilitates asynchronous messaging between services.

## Microservices

# Grocery App Backend - Microservice Architecture

This repository contains the backend of a grocery application designed using a microservice architecture. The system is composed of four distinct microservices, each responsible for specific functionalities within the application. The microservices communicate with each other via RabbitMQ, a message broker that facilitates asynchronous messaging between services.

## Microservices

1. **Customer Service**
   - **Port:** 9000
   - **Description:** Manages user-related operations such as registration, authentication, and profile management.
   - **Routes:**
     - `POST /users/signup` - Register a new user
     - `POST /users/login` - User login
     - `GET /users/address` - Add address
     - `DELETE /user` - Delete user

2. **Shopping Service**
   - **Port:** 9001
   - **Description:** Handles shopping cart operations, including adding items to the cart, removing items, and viewing the cart.
   - **Routes:**
     - `POST /cart/` - Add item to cart
     - `DELETE /cart` - Remove item from cart
     - `GET /cart` - View cart details for logged in User
     - `POST /wishlist/add` - Add item to wishlist
     - `DELETE /wishlist/remove` - Remove item from wishlist
     - `GET /wishlist` - View items in wishlist
     - `POST /order/add` - Place a new order from items available in cart
     - `GET /order/:orderID` - View order details by orderId
     - `GET /order` - View order details for logged in customer

3. **Product Service**
   - **Port:** 9002
   - **Description:** Manages product-related operations such as listing products, product details, and inventory management.
   - **Routes:**
     - `GET /product` - List all products
     - `GET /product/:id` - Get product details by ID
     - `POST /product` - Add a new product
     - `PUT /product` - Update info for an existing product
     - `DELETE /product` - Delete product from DB

4. **Vendor Service**
   - **Port:** 9003
   - **Description:** Manages vendor-related operations including product management and order tracking.
   - **Routes:**
     - `POST /vendor/signup` - Register a new vendor
     - `POST /vendor/login` - Vendor login
     - `DELETE /vendor/product` - Delete product details
     - `POST /vendor/product` - Vendor can add new product
     - `GET /vendor/product` - Vendor can get details for their products
     - `GET /vendor/:productId` - Vendor can get detail of any valid product
     - `GET /order` - Vendor will get order details if some order is placed for logged in vendor

## Communication

The microservices communicate with each other using RabbitMQ as a message broker. This setup ensures loose coupling between services and allows for scalable and reliable message exchanges.

## Prerequisites

To run this project, ensure you have the following prerequisites installed:

- Docker
- Docker Compose
- RabbitMQ

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/yourusername/grocery-app-backend.git
cd grocery-app-backend


## Communication

The microservices communicate with each other using RabbitMQ as a message broker. This setup ensures loose coupling between services and allows for scalable and reliable message exchanges.

## Prerequisites

To run this project, ensure you have the following prerequisites installed:

- Docker
- Docker Compose
- RabbitMQ

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/champ13ns/Grocery-App-backend-Microservice.git
cd grocery-app-backend
docker-compose up
```



**API Endpoints**

Each microservice exposes its API on the specified port. Here are the base URLs:

    User Service: http://localhost:9000
    Shopping Service: http://localhost:9001
    Product Service: http://localhost:9002
    Vendor Service: http://localhost:9003

**License**

This project is licensed under the MIT License. See the LICENSE file for details

**Contact**

If you have any questions or need further assistance, please open an issue or contact the repository owner at sachinfuloria9@gmail.com.
