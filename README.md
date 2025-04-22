# 🚗 Bolttech Car Rental Backend

Welcome to the backend service for the **Bolttech Car Rental MVP** — a car rental platform based in Barcelona

## 🛠 Tech Stack

- **Node.js** with **TypeScript**
- **NestJS** framework
- **PostgreSQL** as the database
- **TypeORM** for database migrations and ORM
- **Docker** for database containerization
- **PNPM** as the package manager

---

## 🚀 Getting Started

Follow the steps below to get the backend up and running:

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Start the PostgreSQL Database

Make sure Docker is running, then:

```bash
docker-compose up -d
```

This will start a PostgreSQL container with the appropriate configuration.

### 3. Run Database Migrations

```bash
pnpm typeorm migration:run
```

This will apply all migrations to the database.

### 4. Start Project

```bash
pnpm start:dev
```

The app should now be running at [http://localhost:8080](http://localhost:8080).

---

## 📡 API Endpoints

The following endpoints are available in this MVP:

### Bookings

- `GET /cars/availability?startDate=&endDate=`  
  Get a list of all available cars in this period

- `POST /bookings`  
  Create a new booking.  
  **Body:**
  ```json
  {
    "carId": "string",
    "userId": "string",
    "name": "string",
    "email": "string",
    "licenseValidUntil": "YYYY-MM-DD"
    "startDate": "YYYY-MM-DD",
    "endDate": "YYYY-MM-DD"
  }
  ```

---

## 📁 Project Structure

```
src/
├── modules/
│   ├── bookings/     # Booking module
│   ├── cars/         # Car module
│   └── users/        # User module
├── database/         # TypeORM config and migrations
├── helpers/          # Helpers shared between modules
├── app.module.ts     # Root module
└── main.ts           # Application entry point
```

---

## 🧪 Running Tests

To run the tests, simply execute:

```bash
pnpm test
```

---

## 🧠 Notes

- This is an MVP designed to demonstrate the booking logic only.
- Authentication, authorization, and advanced validations are out of scope for this phase.

---
