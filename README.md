# High-Concurrency Flash Sale System

This repository contains the pure Java concurrency backend and frontend UI for our 7-day term project. 

## API Contracts
Frontend developers (Members 3 & 4) should use the hardcoded JSON objects below to build the static UI layouts and wire the initial application states.

### 1. Fetch Active Flash Sale
Provides the mock data needed to build the static frontend product display.

**GET** `/api/products/flash-sale`

**Response:**
```json
{
  "productId": 101,
  "productName": "Sony Noise-Cancelling Headphones",
  "totalStock": 50,
  "remainingStock": 50,
  "status": "ACTIVE"
}
```

---

### 2. The Purchase Request
Triggered when the user clicks the "Buy" button. 

**POST** `/api/buy`

**Request:**
```json
{
  "userId": "user_12345",
  "itemId": 101
}
```

**Response (Success):**
```json
{
  "status": "SUCCESS",
  "message": "Order placed successfully.",
  "orderId": "ORD-998877"
}
```

**Response (Failure States - Sold Out or System Busy):**
```json
{
  "status": "FAILED",
  "message": "Sold Out" 
}
```

---

### 3. The Concurrency Simulator
Triggered by the Admin Dashboard's "Run 1,000 Users" button to generate fake concurrent users that attack the system. The frontend will parse this payload to render the final stress-test metrics.

**POST** `/api/simulate`

**Request:**
```json
{
  "productId": 101,
  "simulatedUsers": 1000
}
```

**Response:**
```json
{
  "totalRequests": 1000,
  "successfulOrders": 50,
  "failedOrders": 950,
  "oversold": 0,
  "executionTimeMs": 1432
}
```
