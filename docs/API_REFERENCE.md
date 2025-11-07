# API Reference

Complete API documentation for Task Manager backend endpoints.

## Base URL

```
Development: http://localhost:5000/api
Production: YOUR_API_URL/api
```

## Authentication

All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Login User
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Current User
```http
GET /api/auth/me
```

**Headers:** `Authorization: Bearer <token>`

---

## Task Endpoints

### Create Task
```http
POST /api/tasks
```

**Request Body:**
```json
{
  "title": "Complete project",
  "description": "Finish the task manager project",
  "priority": "high",
  "dueDate": "2024-12-31",
  "tags": ["work", "urgent"]
}
```

### Get All Tasks
```http
GET /api/tasks?status=pending&priority=high&sort=dueDate
```

**Query Parameters:**
- `status` - Filter by status (pending, completed)
- `priority` - Filter by priority (low, medium, high)
- `tags` - Filter by tags
- `search` - Search in title and description
- `sort` - Sort by field
- `page` - Page number
- `limit` - Items per page

### Update Task
```http
PUT /api/tasks/:id
```

### Delete Task
```http
DELETE /api/tasks/:id
```

### Toggle Completion
```http
PATCH /api/tasks/:id/complete
```

### Bulk Operations
```http
POST /api/tasks/bulk-complete
DELETE /api/tasks/bulk-delete
```

---

## Advanced Features

### Upload Attachments
```http
POST /api/tasks/:id/attachments
```

**Content-Type:** `multipart/form-data`

### Search Tasks
```http
GET /api/tasks/search?q=meeting
```

### Share Task
```http
POST /api/tasks/:id/share
```

### Get Task History
```http
GET /api/tasks/:id/history
```

---

## Analytics Endpoints

### Get Overview
```http
GET /api/analytics/overview
```

### Get Productivity Trends
```http
GET /api/analytics/productivity?period=week
```

### Get Streaks
```http
GET /api/analytics/streaks
```

---

## Import/Export

### Export
```http
GET /api/export/csv
GET /api/export/json
```

### Import
```http
POST /api/import/csv
POST /api/import/json
```

---

## Error Responses

```json
{
  "success": false,
  "error": "Error message here"
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Server Error
