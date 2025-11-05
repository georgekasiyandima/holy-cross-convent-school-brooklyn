# School Hub API Endpoints - Postman Testing Guide

## Base URL
- **Development**: `http://localhost:5000/api`
- **Production**: `{YOUR_BACKEND_URL}/api`

---

## 📅 Calendar & Events Endpoints

### 1. Get All Events (Unified)
**GET** `/school-hub/events`

**Description**: Fetches events from both Event and AcademicCalendar models

**Query Parameters**:
- `year` (optional): Filter by year (e.g., `2025`)
- `month` (optional): Filter by month 1-12 (e.g., `11`)
- `category` (optional): Filter by category (e.g., `academic`, `spiritual`, `cultural`, `sports`, `community`)
- `type` (optional): Filter by type (e.g., `EXAM`, `HOLIDAY`, `CULTURAL_DAY`, etc.)
- `grade` (optional): Filter by grade (e.g., `all`, `0`, `1`, `2`, etc.)
- `startDate` (optional): Start date for range filter (ISO format)
- `endDate` (optional): End date for range filter (ISO format)
- `upcoming` (optional): Only return future events (`true`/`false`)
- `source` (optional): Filter by source (`event`, `academic`, or omit for both)

**Example Requests**:
```
GET /api/school-hub/events
GET /api/school-hub/events?year=2025&month=11
GET /api/school-hub/events?upcoming=true&limit=10
GET /api/school-hub/events?category=academic&source=academic
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "startDate": "2025-01-15T00:00:00.000Z",
      "endDate": "2025-01-15T00:00:00.000Z",
      "location": "string",
      "imageUrl": "string",
      "category": "string",
      "type": "string",
      "source": "event" | "academic",
      "isHoliday": boolean,
      "isExam": boolean,
      "grade": "string",
      "time": "string"
    }
  ],
  "count": 10,
  "filters": {
    "year": "2025",
    "month": "11"
  }
}
```

---

### 2. Get Upcoming Events
**GET** `/school-hub/events/upcoming`

**Description**: Get upcoming events from both sources

**Query Parameters**:
- `limit` (optional): Number of events to return (default: 10)

**Example Request**:
```
GET /api/school-hub/events/upcoming?limit=5
```

**Response**:
```json
{
  "success": true,
  "data": [...],
  "count": 5
}
```

---

### 3. Get Single Event by ID
**GET** `/school-hub/events/:id`

**Description**: Get a single event by ID (searches both models)

**Example Request**:
```
GET /api/school-hub/events/cm1234567890abcdef
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "title": "string",
    "description": "string",
    "startDate": "2025-01-15T00:00:00.000Z",
    "endDate": "2025-01-15T00:00:00.000Z",
    "location": "string",
    "category": "string",
    "type": "string",
    "source": "event" | "academic"
  }
}
```

---

### 4. Create Event (Protected - Admin/Editor)
**POST** `/school-hub/events`

**Headers**:
- `Authorization: Bearer {JWT_TOKEN}`

**Request Body**:
```json
{
  "title": "School Sports Day",
  "description": "Annual sports day event",
  "startDate": "2025-03-15T08:00:00.000Z",
  "endDate": "2025-03-15T16:00:00.000Z",
  "location": "School Grounds",
  "imageUrl": "/uploads/events/sports-day.jpg",
  "category": "sports",
  "type": "SPORTS_DAY",
  "isHoliday": false,
  "isExam": false,
  "isPublicHoliday": false,
  "grade": "all",
  "time": "08:00",
  "eventType": "academic",
  "isPublished": true
}
```

**Response**:
```json
{
  "success": true,
  "message": "Event created successfully",
  "data": { ... }
}
```

---

### 5. Update Event (Protected - Admin/Editor)
**PUT** `/school-hub/events/:id`

**Headers**:
- `Authorization: Bearer {JWT_TOKEN}`

**Request Body**: (Same as Create, all fields optional)

**Example Request**:
```
PUT /api/school-hub/events/cm1234567890abcdef
```

**Response**:
```json
{
  "success": true,
  "message": "Event updated successfully",
  "data": { ... }
}
```

---

### 6. Delete Event (Protected - Admin/Editor)
**DELETE** `/school-hub/events/:id`

**Headers**:
- `Authorization: Bearer {JWT_TOKEN}`

**Example Request**:
```
DELETE /api/school-hub/events/cm1234567890abcdef
```

**Response**:
```json
{
  "success": true,
  "message": "Event deleted successfully"
}
```

---

## 📢 Announcements Endpoints

### 7. Get All Announcements (Unified)
**GET** `/school-hub/announcements`

**Description**: Fetches both NewsArticles and Newsletters as announcements

**Query Parameters**:
- `limit` (optional): Number of announcements (default: 10, max: 50)
- `priority` (optional): Filter by priority (`LOW`, `NORMAL`, `HIGH`, `URGENT`)
- `type` (optional): Filter by type (`news` or `newsletter`)
- `published` (optional): Only return published items (default: `true`)

**Example Requests**:
```
GET /api/school-hub/announcements
GET /api/school-hub/announcements?limit=20&type=news
GET /api/school-hub/announcements?priority=URGENT
GET /api/school-hub/announcements?type=newsletter&published=true
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "title": "string",
      "content": "string",
      "summary": "string",
      "imageUrl": "string | null",
      "type": "news" | "newsletter",
      "priority": "LOW" | "NORMAL" | "HIGH" | "URGENT",
      "publishedAt": "2025-01-15T00:00:00.000Z",
      "createdAt": "2025-01-15T00:00:00.000Z",
      "updatedAt": "2025-01-15T00:00:00.000Z",
      "author": {
        "id": "string",
        "name": "string",
        "email": "string"
      }
    }
  ],
  "count": 10,
  "total": 15
}
```

---

### 8. Get Latest Announcements (For Home Page)
**GET** `/school-hub/announcements/latest`

**Description**: Get latest announcements for home page display

**Query Parameters**:
- `limit` (optional): Number of announcements (default: 5, max: 10)

**Example Request**:
```
GET /api/school-hub/announcements/latest?limit=5
```

**Response**:
```json
{
  "success": true,
  "data": [...],
  "count": 5
}
```

---

## 📰 News Article Endpoints

### 9. Get All Published News Articles
**GET** `/news`

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search in title, content, summary
- `category` (optional): Filter by category

**Example Requests**:
```
GET /api/news
GET /api/news?page=1&limit=10
GET /api/news?search=sports
```

**Response**:
```json
{
  "success": true,
  "data": {
    "articles": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

---

### 10. Get Single News Article
**GET** `/news/:id`

**Example Request**:
```
GET /api/news/cm1234567890abcdef
```

**Response**:
```json
{
  "success": true,
  "data": {
    "article": {
      "id": "string",
      "title": "string",
      "content": "string",
      "summary": "string",
      "imageUrl": "string",
      "isPublished": true,
      "publishedAt": "2025-01-15T00:00:00.000Z",
      "priority": "NORMAL",
      "createdAt": "2025-01-15T00:00:00.000Z",
      "updatedAt": "2025-01-15T00:00:00.000Z"
    }
  }
}
```

---

### 11. Create News Article (Protected - Admin/Editor)
**POST** `/news`

**Headers**:
- `Authorization: Bearer {JWT_TOKEN}`
- `Content-Type: application/json`

**Request Body**:
```json
{
  "title": "Welcome Back to School",
  "content": "Full article content here...",
  "summary": "Brief summary of the article",
  "imageUrl": "/uploads/news/welcome-back.jpg",
  "isPublished": true,
  "priority": "NORMAL",
  "tagIds": ["tag-id-1", "tag-id-2"]
}
```

**Response**:
```json
{
  "success": true,
  "message": "News article created successfully",
  "data": {
    "article": { ... }
  }
}
```

---

### 12. Update News Article (Protected - Admin/Editor)
**PUT** `/news/:id`

**Headers**:
- `Authorization: Bearer {JWT_TOKEN}`

**Request Body**: (Same as Create, all fields optional)

**Example Request**:
```
PUT /api/news/cm1234567890abcdef
```

**Response**:
```json
{
  "success": true,
  "message": "News article updated successfully",
  "data": {
    "article": { ... }
  }
}
```

---

### 13. Delete News Article (Protected - Admin/Editor)
**DELETE** `/news/:id`

**Headers**:
- `Authorization: Bearer {JWT_TOKEN}`

**Example Request**:
```
DELETE /api/news/cm1234567890abcdef
```

**Response**:
```json
{
  "success": true,
  "message": "News article deleted successfully"
}
```

---

## 📧 Newsletter Endpoints (If Newsletter Model Exists)

### 14. Get All Newsletters
**GET** `/newsletters`

**Query Parameters**:
- `status` (optional): Filter by status (`DRAFT`, `SCHEDULED`, `SENDING`, `SENT`, `FAILED`)
- `priority` (optional): Filter by priority
- `authorId` (optional): Filter by author ID
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Example Request**:
```
GET /api/newsletters?status=SENT&page=1&limit=20
```

**Response**:
```json
{
  "newsletters": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "pages": 3
  }
}
```

---

### 15. Get Single Newsletter
**GET** `/newsletters/:id`

**Example Request**:
```
GET /api/newsletters/cm1234567890abcdef
```

**Response**:
```json
{
  "id": "string",
  "title": "string",
  "content": "string",
  "priority": "NORMAL",
  "status": "SENT",
  "sentAt": "2025-01-15T00:00:00.000Z",
  "author": { ... }
}
```

---

### 16. Create Newsletter (Protected - Admin Only)
**POST** `/newsletters`

**Headers**:
- `Authorization: Bearer {JWT_TOKEN}`

**Request Body**:
```json
{
  "title": "Monthly Newsletter - January 2025",
  "content": "Newsletter content here...",
  "priority": "NORMAL",
  "scheduledFor": "2025-01-15T08:00:00.000Z",
  "targetAudience": "ALL",
  "gradeLevels": ["Grade R", "Grade 1"],
  "attachments": ["/uploads/newsletters/january.pdf"]
}
```

**Response**:
```json
{
  "id": "string",
  "title": "string",
  "content": "string",
  "status": "DRAFT",
  ...
}
```

---

### 17. Update Newsletter (Protected - Admin Only)
**PUT** `/newsletters/:id`

**Headers**:
- `Authorization: Bearer {JWT_TOKEN}`

**Request Body**: (Same as Create, all fields optional)

**Example Request**:
```
PUT /api/newsletters/cm1234567890abcdef
```

---

### 18. Send Newsletter (Protected - Admin Only)
**POST** `/newsletters/:id/send`

**Headers**:
- `Authorization: Bearer {JWT_TOKEN}`

**Example Request**:
```
POST /api/newsletters/cm1234567890abcdef/send
```

**Response**:
```json
{
  "message": "Newsletter sent successfully",
  "sentCount": 150,
  "failedCount": 0
}
```

---

### 19. Delete Newsletter (Protected - Admin Only)
**DELETE** `/newsletters/:id`

**Headers**:
- `Authorization: Bearer {JWT_TOKEN}`

**Example Request**:
```
DELETE /api/newsletters/cm1234567890abcdef
```

---

## 🔐 Authentication Endpoints

### 20. Admin Login
**POST** `/auth/login`

**Request Body**:
```json
{
  "email": "admin@example.com",
  "password": "your-password"
}
```

**Response**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "ADMIN"
  }
}
```

**Use this token in Authorization header for protected endpoints:**
```
Authorization: Bearer {token}
```

---

## 📋 Quick Test Checklist

### Public Endpoints (No Auth Required):
- [ ] `GET /api/school-hub/events`
- [ ] `GET /api/school-hub/events/upcoming`
- [ ] `GET /api/school-hub/events/:id`
- [ ] `GET /api/school-hub/announcements`
- [ ] `GET /api/school-hub/announcements/latest`
- [ ] `GET /api/news`
- [ ] `GET /api/news/:id`

### Protected Endpoints (Require Auth):
- [ ] `POST /api/auth/login` (Get token first)
- [ ] `POST /api/school-hub/events` (Create event)
- [ ] `PUT /api/school-hub/events/:id` (Update event)
- [ ] `DELETE /api/school-hub/events/:id` (Delete event)
- [ ] `POST /api/news` (Create news)
- [ ] `PUT /api/news/:id` (Update news)
- [ ] `DELETE /api/news/:id` (Delete news)

---

## 🧪 Sample Postman Collection Structure

### Environment Variables
Create a Postman environment with:
- `baseUrl`: `http://localhost:5000/api`
- `token`: (set after login)

### Example Postman Request Setup:

1. **Get All Events**:
   - Method: `GET`
   - URL: `{{baseUrl}}/school-hub/events?upcoming=true&limit=10`

2. **Get Latest Announcements**:
   - Method: `GET`
   - URL: `{{baseUrl}}/school-hub/announcements/latest?limit=5`

3. **Create Event** (After Login):
   - Method: `POST`
   - URL: `{{baseUrl}}/school-hub/events`
   - Headers: `Authorization: Bearer {{token}}`
   - Body (JSON):
   ```json
   {
     "title": "Test Event",
     "description": "This is a test event",
     "startDate": "2025-12-15T08:00:00.000Z",
     "category": "community",
     "eventType": "event",
     "isPublished": true
   }
   ```

---

## 🔍 Testing Tips

1. **Start with Public Endpoints**: Test GET endpoints first (no auth needed)
2. **Login First**: Use `/api/auth/login` to get a token for protected endpoints
3. **Check Response Format**: All endpoints return `{ success: true, data: ... }` format
4. **Error Handling**: Failed requests return `{ success: false, error: "message" }`
5. **Date Format**: Use ISO 8601 format for dates: `2025-12-15T08:00:00.000Z`

---

## 📝 Notes

- All dates should be in ISO 8601 format
- Protected endpoints require `Authorization: Bearer {token}` header
- The `source` field in events indicates whether it came from `Event` or `AcademicCalendar` model
- Newsletter endpoints may not work if the Newsletter model doesn't exist in the database
- The announcements endpoint gracefully handles missing Newsletter model


