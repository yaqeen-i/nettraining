# AdminDashboard - Vocational Training Application Management System

A full-stack web application for managing vocational training applications in Jordan. The system handles applicant registration, tracking, and management across multiple regions, institutes, and professions.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Usage Guide](#usage-guide)
- [AI Chatbot Integration](#ai-chatbot-integration)
- [Testing](#testing)
- [Database Schema](#database-schema)
- [Security Features](#security-features)
- [Regions & Institutes Coverage](#regions--institutes-coverage)
- [Data Validation Rules](#data-validation-rules)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)
- [Acknowledgments](#acknowledgments)

## Features

### Admin Features
- **Secure Authentication**: JWT-based admin login and authorization
- **Application Management**: View, edit, and delete applicant forms
- **Advanced Filtering**: Cascading filters by region, area, institute, profession, and status
- **Search Functionality**: Quick search by National ID
- **Excel Import/Export**: Bulk import and export applicant data
- **Status Tracking**: Multi-stage application workflow (Pending → Phone Call → Exam → Documents → Accepted/Rejected)
- **AI Assistant**: Intelligent chatbot for database queries in Arabic

### Applicant Features
- **Registration Form**: Multi-step cascading form with validation
- **Dynamic Field Loading**: Areas, institutes, and professions load based on selections
- **Data Validation**: 
  - Age restrictions (Male: 17-30, Female: 17-35)
  - Phone number format validation
  - National ID validation
  - Education level verification

### System Features
- **Hierarchical Data Structure**: Region → Area → Institute → Profession
- **Gender-Based Filtering**: Professions filtered by allowed gender
- **Duplicate Prevention**: Checks for existing National ID and phone number
- **Responsive Design**: Works on desktop and mobile devices
- **Arabic/English Support**: Bilingual interface

## Tech Stack

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Database**: MySQL 8.0
- **ORM**: Sequelize
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Testing**: Jest, Supertest

### Frontend
- **Framework**: React 18
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Styling**: Custom CSS with AnNahar font
- **Excel Processing**: SheetJS (xlsx)
- **Internationalization**: i18next

### DevOps
- **Containerization**: Docker, Docker Compose
- **Database Management**: MySQL container with health checks

### AI Integration
- **Chatbot**: FastAPI-based AI model (via ngrok)
- **Natural Language Processing**: Database query generation from Arabic questions

## Prerequisites

- Node.js 20 or higher
- MySQL 8.0
- Docker and Docker Compose (optional)
- npm or yarn package manager

## Installation

### Option 1: Docker Compose (Recommended)

1. **Clone the repository**
```bash
git clone <repository-url>
cd AdminDashboard-frontback
```

2. **Configure environment variables**
```bash
# Backend environment
cp backdn/.env.example backdn/.env
# Edit backdn/.env with your configuration
```

3. **Start the application**
```bash
docker-compose up --build
```

The services will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MySQL: localhost:3306

### Option 2: Manual Setup

#### Backend Setup

1. **Navigate to backend directory**
```bash
cd backdn
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env file with your database credentials
```

4. **Start the backend server**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

#### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontdn
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm start
```

## Environment Variables

### Backend (.env)

```env
# Database Configuration
DB_HOST=localhost                    # Database host (use 'db' for Docker)
DB_USER=db29120                      # Database username
DB_PASS=your_password                # Database password
DB_NAME=db29120                      # Database name
DB_PORT=3306                         # MySQL port

# Server Configuration
PORT=5000                            # Backend server port

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here  # Secret for JWT token generation

# Node Environment
NODE_ENV=development                 # development | production
```

### Frontend

Update the API URL in `frontdn/src/services/formApi.js` and `frontdn/src/services/adminApi.js`:

```javascript
const API_URL = "http://localhost:5000"; // Your backend URL
```

## Running the Application

### Using Docker Compose

Once you've configured your environment variables, start all services:

```bash
docker-compose up --build
```

To run in detached mode:
```bash
docker-compose up -d
```

To stop the services:
```bash
docker-compose down
```

To view logs:
```bash
docker-compose logs -f
```

### Manual Mode

**Terminal 1 - Backend:**
```bash
cd backdn
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontdn
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### First Time Setup

1. The database tables will be created automatically on first run
2. Create an admin account using the register endpoint or seed script
3. Login at http://localhost:3000/login

## API Documentation

### Authentication Endpoints

#### Login
```http
POST /admin/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password"
}

Response: { "message": "Login successful", "token": "JWT_TOKEN" }
```

#### Register Admin (Protected)
```http
POST /admin/register
Authorization: Bearer {token}
Content-Type: application/json

{
  "username": "newadmin",
  "email": "admin@example.com",
  "password": "password123"
}
```

### Form Management Endpoints

#### Get All Forms (Protected)
```http
GET /forms
Authorization: Bearer {token}
```

#### Create Form
```http
POST /forms
Content-Type: application/json

{
  "nationalID": "1234567890",
  "phoneNumber": "0791234567",
  "firstName": "أحمد",
  "fatherName": "محمد",
  "grandFatherName": "علي",
  "lastName": "الأحمد",
  "dateOfBirth": "2000-01-01",
  "gender": "MALE",
  "educationLevel": "HIGH_SCHOOL",
  "residence": "عمان",
  "howDidYouHearAboutUs": "SOCIAL_MEDIA",
  "region": "CENTRAL",
  "area": "الزرقاء",
  "institute": "معهد الزرقاء",
  "profession": "مشغل أنظمة الطاقة الشمسية"
}
```

#### Update Form (Protected)
```http
PUT /forms/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "ACCEPTED",
  "mark": 85,
  "requiredDocuments": "YES"
}
```

#### Delete Form (Protected)
```http
DELETE /forms/:id
Authorization: Bearer {token}
```

#### Import Forms (Protected)
```http
POST /forms/import
Authorization: Bearer {token}
Content-Type: application/json

[
  { /* form data */ },
  { /* form data */ }
]
```

### Reference Data Endpoints

```http
GET /api/regions
GET /api/areas?region=CENTRAL
GET /api/institutes?region=CENTRAL&area=الزرقاء
GET /api/professions?region=CENTRAL&area=الزرقاء&institute=معهد الزرقاء&gender=MALE
```

## Project Structure

```
AdminDashboard-frontback/
├── backdn/                          # Backend application
│   ├── src/
│   │   ├── config/                  # Configuration files
│   │   │   ├── db.js               # Database connection
│   │   │   └── validationConfig.js # Profession validation rules
│   │   ├── controllers/            # Request handlers
│   │   │   ├── adminController.js
│   │   │   ├── formController.js
│   │   │   └── referenceDataController.js
│   │   ├── middleware/             # Custom middleware
│   │   │   ├── authMiddleware.js   # JWT authentication
│   │   │   └── authorizeAdmin.js   # Authorization checks
│   │   ├── models/                 # Sequelize models
│   │   │   ├── adminModel.js
│   │   │   ├── formModel.js
│   │   │   ├── regionModel.js
│   │   │   ├── areaModel.js
│   │   │   ├── institute.js
│   │   │   └── profession.js
│   │   ├── routes/                 # API routes
│   │   │   ├── adminRoutes.js
│   │   │   ├── formRoutes.js
│   │   │   └── referenceData.js
│   │   ├── app.js                  # Express app setup
│   │   └── server.js               # Server entry point
│   ├── tests/                      # Test files
│   ├── .env                        # Environment variables
│   ├── Dockerfile
│   └── package.json
│
├── frontdn/                        # Frontend application
│   ├── src/
│   │   ├── components/            # React components
│   │   │   ├── CascadingSelects.jsx
│   │   │   ├── FormEditModal.jsx
│   │   │   ├── FormTable.jsx
│   │   │   ├── floatingChat.jsx
│   │   │   └── Navbar.jsx
│   │   ├── pages/                 # Page components
│   │   │   ├── AdminDashboardPage.jsx
│   │   │   ├── adminLoginPage.jsx
│   │   │   └── FormEditPage.jsx
│   │   ├── services/              # API service files
│   │   │   ├── adminApi.js
│   │   │   ├── formApi.js
│   │   │   └── aiModelApi.js
│   │   ├── styles/                # CSS files
│   │   ├── App.js                 # Main app component
│   │   ├── index.js               # React entry point
│   │   └── i18n.js                # Internationalization
│   ├── Dockerfile
│   └── package.json
│
└── docker-compose.yml             # Docker Compose configuration
```

## Usage Guide

### Admin Workflow

1. **Login**
   - Navigate to `/login`
   - Enter admin credentials
   - System redirects to dashboard on success

2. **View Applications**
   - Dashboard displays all applicant forms
   - Use filters to narrow down results:
     - Region (NORTHERN, CENTRAL, SOUTHERN)
     - Area within region
     - Institute
     - Profession
     - Application status
   - Search by National ID

3. **Edit Application**
   - Click "Edit" button on any form
   - Update applicant information
   - Change status through workflow stages
   - Assign marks (0-100)
   - Mark required documents as received

4. **Application Status Workflow**
   - **PENDING**: Initial submission
   - **PHONE_CALL**: After initial contact
   - **PASSED_THE_EXAM**: After examination
   - **WAITING_FOR_DOCUMENTS**: Documents requested
   - **ACCEPTED**: Final acceptance
   - **REJECTED**: Application rejected

5. **Excel Operations**
   - **Export**: Click "تصدير إلى Excel" to download all visible forms
   - **Import**: Click "استيراد من Excel" to bulk upload
     - Must match exact column format
     - Phone numbers and National IDs formatted as text

### AI Chatbot Usage

Click the chatbot button (🤖) in the bottom right corner and ask questions in Arabic:

**Example queries:**
- كم عدد الطلاب؟ (How many students?)
- من الطلاب اللي عمرهم أكبر من 25؟ (Students older than 25?)
- كم عدد الإناث من الشمال؟ (How many females from the north?)
- اعرض أسماء الطلاب (Show student names)

## AI Chatbot Integration

The system includes an intelligent Arabic chatbot that can query the database using natural language.

### Setup

1. **Configure AI Model URL**

Edit `frontdn/src/services/aiModelApi.js`:

```javascript
const AI_MODEL_BASE_URL = "https://your-ngrok-url.ngrok-free.app";
```

2. **AI Model Requirements**

The chatbot expects a FastAPI backend with the following endpoint:

```python
@app.post("/ask")
async def ask_question(request: QuestionRequest):
    # Process natural language question
    # Generate SQL query
    # Execute and return results
    return {
        "answer": "النتيجة...",
        "results": [...],  # Query results
        "intent": "count_students"
    }
```

### Features

- Natural language understanding in Arabic
- SQL query generation
- Results displayed in formatted tables
- Conversation history maintained during session
- Error handling and user feedback

## Testing

### Run Backend Tests

```bash
cd backdn
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Test Coverage

The backend includes comprehensive tests for:
- Admin authentication and authorization
- Form CRUD operations
- Data validation
- Reference data endpoints
- Middleware functionality

## Database Schema

### Key Tables

**admins**
- id (PK)
- username (unique)
- email (unique)
- password (hashed)
- createdAt, updatedAt

**userForm**
- id (PK)
- nationalID (unique)
- phoneNumber (unique)
- firstName, fatherName, grandFatherName, lastName
- dateOfBirth, gender, educationLevel
- region (FK), area (FK), institute (FK), profession
- residence, howDidYouHearAboutUs
- status, mark, requiredDocuments
- createdAt, updatedAt

**regions**
- name (PK): NORTHERN, CENTRAL, SOUTHERN

**areas**
- name (PK)
- regionName (FK)

**institutes**
- name (PK)
- areaName (FK)
- regionName (FK)

**professions**
- name, areaName, regionName (Composite PK)
- allowedGenders (JSON array)

## Security Features

- **JWT Authentication**: Secure token-based auth with 30-day expiration
- **Password Hashing**: bcrypt with salt rounds
- **SQL Injection Prevention**: Sequelize ORM with parameterized queries
- **CORS Configuration**: Controlled cross-origin requests
- **Authorization Middleware**: Protected admin-only routes
- **Input Validation**: Comprehensive data validation rules
- **Self-Access Only**: Admins can only modify their own accounts

## Regions & Institutes Coverage

### Northern Region (NORTHERN)
- الرمثا, جرش, الكورة, المفرق, السرحان, عجلون

### Central Region (CENTRAL)
- الزرقاء, الموقر, مادبا, ماركا الصناعي, ذيبان

### Southern Region (SOUTHERN)
- الكرك, معان, الطفيلة, القويرة, الريشة, الجفر

## Data Validation Rules

### Age Restrictions
- **Male applicants**: 17-30 years
- **Female applicants**: 17-35 years

### Field Validations
- **National ID**: Exactly 10 numeric digits, unique
- **Phone Number**: Format `07[789]XXXXXXX`, unique
- **Names**: 2-15 characters, Arabic/English letters only
- **Education Level**: HIGH_SCHOOL, DIPLOMA, BACHELOR, MASTER, MIDDLE_SCHOOL
- **Gender**: MALE, FEMALE
- **Marks**: 0-100 (optional)

## Future Enhancements

- [ ] Document upload system (AWS S3 integration)
- [ ] Email notifications for status changes
- [ ] Multi-admin role system (Super Admin, Viewer, Editor)
- [ ] Advanced analytics and reporting dashboard
- [ ] SMS notifications for applicants
- [ ] Automated exam scheduling
- [ ] Interview scheduling module
- [ ] Certificate generation
- [ ] Mobile app for applicants

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Support

For support, email Yaqeen.hamza98@gmail.com or create an issue in the repository.

## Acknowledgments

- Vocational Training Corporation (VTC) Jordan
- All contributing developers and testers
- Open source community for the amazing tools

---

**Built with for NET Vocational Training in Jordan**