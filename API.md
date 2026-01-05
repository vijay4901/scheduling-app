# API Documentation

Base URL: `http://localhost:3000/api` (development) or `https://yourdomain.com/api` (production)

## Authentication

Most endpoints require authentication via JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

Get token from login/signup response and store in localStorage.

---

## Endpoints

### Authentication

#### POST `/auth/signup`

Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "username": "johndoe",
    "timezone": "America/New_York",
    "createdAt": "2024-01-15T10:00:00Z"
  },
  "token": "jwt_token_here"
}
```

**Errors:**
- 400: Invalid input / Email or username already exists

---

#### POST `/auth/login`

Login to existing account.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "username": "johndoe",
    "timezone": "America/New_York"
  },
  "token": "jwt_token_here"
}
```

**Errors:**
- 401: Invalid credentials

---

#### GET `/auth/me`

Get current authenticated user.

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "username": "johndoe",
    "timezone": "America/New_York",
    "avatarUrl": null,
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
}
```

**Errors:**
- 401: Unauthorized (no token or invalid token)

---

### Event Types

#### GET `/event-types`

List all event types for authenticated user.

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Response (200):**
```json
{
  "eventTypes": [
    {
      "id": "uuid",
      "userId": "uuid",
      "name": "30 Minute Meeting",
      "slug": "30-min-meeting",
      "description": "Quick sync meeting",
      "duration": 30,
      "color": "#3B82F6",
      "isActive": true,
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

---

#### POST `/event-types`

Create a new event type.

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Request Body:**
```json
{
  "name": "30 Minute Meeting",
  "slug": "30-min-meeting",
  "description": "Quick sync meeting",
  "duration": 30,
  "color": "#3B82F6"
}
```

**Response (201):**
```json
{
  "eventType": {
    "id": "uuid",
    "userId": "uuid",
    "name": "30 Minute Meeting",
    "slug": "30-min-meeting",
    "description": "Quick sync meeting",
    "duration": 30,
    "color": "#3B82F6",
    "isActive": true,
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

**Errors:**
- 400: Invalid input / Slug already exists

---

#### GET `/event-types/:id`

Get specific event type.

**Response (200):**
```json
{
  "eventType": {
    "id": "uuid",
    "name": "30 Minute Meeting",
    "slug": "30-min-meeting",
    "description": "Quick sync meeting",
    "duration": 30,
    "color": "#3B82F6",
    "isActive": true
  }
}
```

---

#### PUT `/event-types/:id`

Update event type.

**Request Body:**
```json
{
  "name": "45 Minute Meeting",
  "slug": "45-min-meeting",
  "duration": 45,
  "color": "#10B981"
}
```

**Response (200):**
```json
{
  "eventType": { /* updated event type */ }
}
```

---

#### DELETE `/event-types/:id`

Delete event type.

**Response (200):**
```json
{
  "message": "Event type deleted successfully"
}
```

---

### Availability

#### GET `/availability`

Get user's availability rules.

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Response (200):**
```json
{
  "availability": [
    {
      "id": "uuid",
      "userId": "uuid",
      "dayOfWeek": 1,
      "startTime": "09:00",
      "endTime": "17:00",
      "timezone": "America/New_York",
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

---

#### POST `/availability`

Set availability rules (replaces existing).

**Request Body:**
```json
{
  "availability": [
    {
      "dayOfWeek": 1,
      "startTime": "09:00",
      "endTime": "17:00",
      "timezone": "America/New_York"
    },
    {
      "dayOfWeek": 2,
      "startTime": "09:00",
      "endTime": "17:00",
      "timezone": "America/New_York"
    }
  ]
}
```

**Response (200):**
```json
{
  "availability": [ /* created rules */ ]
}
```

---

#### GET `/availability/slots`

Get available time slots for booking.

**Query Parameters:**
- `date` (required): YYYY-MM-DD format
- `eventTypeId` (required): UUID of event type
- `timezone` (optional): Timezone (defaults to UTC)

**Example:**
```
GET /availability/slots?date=2024-01-20&eventTypeId=uuid&timezone=America/New_York
```

**Response (200):**
```json
{
  "slots": [
    "2024-01-20T14:00:00.000Z",
    "2024-01-20T14:30:00.000Z",
    "2024-01-20T15:00:00.000Z"
  ],
  "timezone": "America/New_York"
}
```

---

### Bookings

#### GET `/bookings`

List bookings for authenticated user.

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Query Parameters:**
- `status` (optional): Filter by status (confirmed, cancelled, completed)

**Response (200):**
```json
{
  "bookings": [
    {
      "id": "uuid",
      "eventTypeId": "uuid",
      "userId": "uuid",
      "attendeeName": "Jane Smith",
      "attendeeEmail": "jane@example.com",
      "attendeeNotes": "Looking forward to it!",
      "startTime": "2024-01-20T14:00:00.000Z",
      "endTime": "2024-01-20T14:30:00.000Z",
      "timezone": "America/New_York",
      "status": "confirmed",
      "googleEventId": null,
      "createdAt": "2024-01-15T10:00:00Z",
      "eventType": {
        "name": "30 Minute Meeting",
        "duration": 30,
        "color": "#3B82F6"
      }
    }
  ]
}
```

---

#### POST `/bookings`

Create a new booking (public endpoint - no auth required).

**Request Body:**
```json
{
  "eventTypeId": "uuid",
  "attendeeName": "Jane Smith",
  "attendeeEmail": "jane@example.com",
  "attendeeNotes": "Looking forward to it!",
  "startTime": "2024-01-20T14:00:00.000Z",
  "timezone": "America/New_York"
}
```

**Response (201):**
```json
{
  "booking": {
    "id": "uuid",
    "eventTypeId": "uuid",
    "userId": "uuid",
    "attendeeName": "Jane Smith",
    "attendeeEmail": "jane@example.com",
    "startTime": "2024-01-20T14:00:00.000Z",
    "endTime": "2024-01-20T14:30:00.000Z",
    "status": "confirmed",
    "eventType": { /* event details */ },
    "user": { /* host details */ }
  }
}
```

**Errors:**
- 404: Event type not found
- 409: Time slot no longer available

---

#### PUT `/bookings/:id/cancel`

Cancel a booking.

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Request Body:**
```json
{
  "reason": "Schedule conflict"
}
```

**Response (200):**
```json
{
  "booking": {
    "id": "uuid",
    "status": "cancelled",
    "cancellationReason": "Schedule conflict"
  }
}
```

**Errors:**
- 404: Booking not found
- 400: Already cancelled

---

### Users (Public)

#### GET `/users/:username`

Get public user profile and their event types.

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "username": "johndoe",
    "timezone": "America/New_York",
    "avatarUrl": null
  },
  "eventTypes": [
    {
      "id": "uuid",
      "name": "30 Minute Meeting",
      "slug": "30-min-meeting",
      "description": "Quick sync",
      "duration": 30,
      "color": "#3B82F6"
    }
  ]
}
```

**Errors:**
- 404: User not found

---

#### GET `/users/:username/:slug`

Get specific event type for user.

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "username": "johndoe",
    "timezone": "America/New_York"
  },
  "eventType": {
    "id": "uuid",
    "name": "30 Minute Meeting",
    "slug": "30-min-meeting",
    "description": "Quick sync",
    "duration": 30,
    "color": "#3B82F6"
  }
}
```

**Errors:**
- 404: User or event type not found

---

### Calendar Integration

#### GET `/calendar/connect`

Initiate Google Calendar OAuth flow.

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Response:**
Redirects to Google OAuth consent screen.

---

#### GET `/calendar/callback`

OAuth callback endpoint (handled automatically).

**Query Parameters:**
- `code`: Authorization code from Google
- `state`: User ID

**Response:**
Redirects to dashboard with success/error message.

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message here"
}
```

### Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request (invalid input)
- `401`: Unauthorized (missing or invalid token)
- `404`: Not Found
- `409`: Conflict (e.g., time slot taken)
- `500`: Internal Server Error

---

## Rate Limiting

Currently no rate limiting implemented. Recommended to add in production:

- 100 requests per minute per IP
- 1000 requests per day per user

---

## Webhooks (Not Implemented)

Future enhancement: Webhook support for booking events.

---

## Examples

### Complete Booking Flow

```javascript
// 1. Get user's event types
const response = await fetch('/api/users/johndoe');
const { user, eventTypes } = await response.json();

// 2. Get available slots
const slots = await fetch(
  `/api/availability/slots?date=2024-01-20&eventTypeId=${eventTypes[0].id}&timezone=America/New_York`
);
const { slots: availableSlots } = await slots.json();

// 3. Create booking
const booking = await fetch('/api/bookings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    eventTypeId: eventTypes[0].id,
    attendeeName: 'Jane Smith',
    attendeeEmail: 'jane@example.com',
    startTime: availableSlots[0],
    timezone: 'America/New_York'
  })
});
```

### Authentication Flow

```javascript
// 1. Signup
const signupRes = await fetch('/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    username: 'johndoe',
    password: 'password123'
  })
});
const { token, user } = await signupRes.json();

// 2. Store token
localStorage.setItem('token', token);

// 3. Use token for authenticated requests
const eventTypes = await fetch('/api/event-types', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

---

## Testing

Use tools like:
- Postman
- Insomnia
- cURL
- Thunder Client (VS Code extension)

Example cURL:

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get event types (replace TOKEN)
curl http://localhost:3000/api/event-types \
  -H "Authorization: Bearer TOKEN"
```

---

For more details, see the source code in `app/api/` directory.


