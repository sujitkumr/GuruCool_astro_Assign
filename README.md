# Backend Flow Distribution Algorithm

## 1. Overview of the Task

### Objective
The goal of this feature is to allocate users to astrologers in a fair and balanced manner based on specific parameters like their `isTopAstrologer` status and `flowBoostFactor`. It also ensures dynamic load management for astrologers by tracking their connection limits.

### Secondary Feature
Additionally, it includes CRUD operations for astrologers and a toggle mechanism for prioritizing top astrologers.
site https://gurucool-astro-assign.onrender.com
---

## Key Features
### User Authentication
- Secure signup and signin endpoints for user authentication
- Logout functionality to terminate user sessions.
### User Management
- Retrieve a list of all registered users.
- Dynamically allocate users to astrologers based on defined parameters.
- Update user-astrologer allocations as needed.
### Astrologer Management
- Fetch all astrologers along with their details (e.g., connection capacity, prioritization status).
- Create, update, and delete astrologers.
- Support for dynamic flow updates through adjustable factors like flowBoostFactor.

##  API Documentation

###  Sign Up
**Endpoint:** `/signup`  
**Method:** `POST`  
**Description:** Registers a new user.  
**Controller:** `signUp`

---

### Sign In
**Endpoint:** `/signin`  
**Method:** `POST`  
**Description:** Authenticates a user and provides access tokens.  
**Controller:** `signIn`

---

###  Logout
**Endpoint:** `/logout`  
**Method:** `GET`  
**Description:** Logs out the authenticated user.  
**Controller:** `logout`

### **API : Allocate Users to Astrologers**

**Endpoint:**
- **Method:** POST
- **URL:** `http://localhost:3000/api/allocate-users`

**Request Body:**
- No body is required since the service fetches unassigned users internally.
- Unassigned users are identified in the database with `astrologerId: null`.

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "user": "64a2f5bf52f8b12d34c1e9",
      "astrologer": "78c6d93bf7e8a21b45d5d1"
    },
    {
      "user": "64a2f5bf52f8b12d34c1f2",
      "astrologer": "78c6d93bf7e8a21b45d5d1"
    }
  ]
}
```

**Description:**
- Users are fairly distributed across astrologers based on:
  - `connectionCapacity`
  - `flowBoostFactor`
- The allocation uses a round-robin approach.
- Ensures each astrologer’s current connections are within their limit (calculated as `connectionCapacity * flowBoostFactor`).

---

### **API 2: Get All Astrologers**

**Endpoint:**
- **Method:** GET
- **URL:** `http://localhost:3000/api/astrologers`

**Purpose:**
- Fetch all astrologers and their details.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "78c6d93bf7e8a21b45d5d1",
      "name": "Astrologer 1",
      "isTopAstrologer": true,
      "flowBoostFactor": 1.5,
      "connectionCapacity": 100,
      "currentConnections": 30
    },
    {
      "_id": "78c6d93bf7e8a21b45d5d2",
      "name": "Astrologer 2",
      "isTopAstrologer": false,
      "flowBoostFactor": 1.0,
      "connectionCapacity": 50,
      "currentConnections": 10
    }
  ]
}
```

**Fields:**
- `isTopAstrologer`: Indicates if the astrologer is prioritized.
- `flowBoostFactor`: Factor used to calculate dynamic connection limits.
- `connectionCapacity`: Maximum connections allowed.
- `currentConnections`: Current active connections.

---

### **API 3: Update Astrologer Flow**

**Endpoint:**
- **Method:** PUT
- **URL:** `http://localhost:3000/api/astrologers/update-flow`

**Request Body:**
```json
{
  "astrologerId": "78c6d93bf7e8a21b45d5d1",
  "isTopAstrologer": true,
  "boostFactor": 2.0
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "78c6d93bf7e8a21b45d5d1",
    "name": "Astrologer 1",
    "isTopAstrologer": true,
    "flowBoostFactor": 2.0,
    "connectionCapacity": 100,
    "currentConnections": 30
  }
}
```

**Description:**
- This API allows toggling the `isTopAstrologer` status or updating the `flowBoostFactor` for an astrologer.

---

### **API 4: Delete Astrologer**

**Endpoint:**
- **Method:** DELETE
- **URL:** `http://localhost:3000/api/astrologers/:id`

**Request Example:**
- `http://localhost:3000/api/astrologers/78c6d93bf7e8a21b45d5d1`

**Response:**
```json
{
  "success": true,
  "message": "Astrologer deleted successfully"
}
```

**Description:**
- Deletes an astrologer by their ID.

---

### **Error Handling Example**

**Scenario:** No astrologers available for allocation.

**Endpoint:**
- **POST** `http://localhost:3000/api/allocate-users`

**Response:**
```json
{
  "success": false,
  "message": "No astrologers available for allocation."
}
```

---

## 3. How the Allocation Logic Works

1. **Dynamic Allocation:**
   - The system identifies all unassigned users (`astrologerId: null`).
   - Astrologers are fetched with their current connections and capacities.

2. **Round-Robin Approach:**
   - Users are allocated to astrologers one by one, cycling through the list.

3. **Connection Limits:**
   - An astrologer’s capacity is calculated as `connectionCapacity * flowBoostFactor`.
   - If the current connections exceed the calculated capacity, the system skips that astrologer and moves to the next.

4. **Prioritization:**
   - Top astrologers (`isTopAstrologer: true`) can be prioritized for allocation by modifying the logic or toggling their status.

---

## 4. Closing Notes

1. **Fairness and Scalability:**
   - Ensures fair distribution of users across astrologers.
   - Supports scaling by dynamically adjusting connection limits.

2. **Transactional Integrity:**
   - All allocations are handled transactionally to ensure data consistency.

3. **Error Handling:**
   - Proper error messages are returned for edge cases like unavailable astrologers.



