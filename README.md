# Staff Evaluation System - System Design Document

## Table of Contents

1. [Introduction](#1-introduction)
2. [Architecture Design](#2-architecture-design)
3. [Use Cases](#3-use-cases)
4. [System Flows](#4-system-flows)
5. [Database Design](#5-database-design)
6. [API Design](#6-api-design)
7. [Security Design](#7-security-design)

---

## 1. Introduction

### 1.1 Project Overview

**Staff Evaluation System** (Peer Review Hub) is a web-based application for academic peer review and staff evaluation. It enables faculty members to evaluate their colleagues within designated groups using predefined evaluation criteria, with support for multiple evaluation periods.

### 1.2 Goals

- Enable peer-to-peer evaluation among staff members within evaluation periods
- Provide administrators with tools to manage staff, groups, evaluation periods, and evaluation criteria
- Generate reports and analytics with radar charts and CSV export
- Ensure secure, role-based access control with Microsoft OAuth support

### 1.3 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, TypeScript, Vite, TanStack Query, Tailwind CSS, shadcn/ui, Recharts, Custom Fetch API Client |
| **Backend** | NestJS, Prisma ORM, Passport.js (JWT + Microsoft OAuth) |
| **Database** | PostgreSQL 16 |
| **Authentication** | JWT (Access + Refresh tokens), Microsoft OAuth 2.0 |

---

## 2. Architecture Design

### 2.1 High-Level Architecture

```mermaid
flowchart TB
    subgraph CLIENTS["CLIENTS"]
        Browser["Browser<br/>(React)"]
        Mobile["Mobile<br/>(Future)"]
        AdminPortal["Admin<br/>Portal"]
    end
    
    Browser & Mobile & AdminPortal -->|HTTPS| API_GATEWAY
    
    subgraph API_GATEWAY["API GATEWAY"]
        subgraph NestJS["NestJS Backend"]
            Auth["Auth<br/>Module"]
            Staff["Staff<br/>Module"]
            Groups["Groups<br/>Module"]
            Evaluations["Evaluations<br/>Module"]
            Questions["Questions<br/>Module"]
            OrgUnits["Organization<br/>Units Module"]
            Periods["Evaluation<br/>Periods Module"]
            Users["Users<br/>Module"]
        end
    end
    
    NestJS --> DATA_LAYER
    
    subgraph DATA_LAYER["DATA LAYER"]
        Prisma["Prisma ORM"]
        subgraph PostgreSQL["PostgreSQL 16"]
            staff_db[(staff)]
            groups_db[(groups)]
            questions_db[(questions)]
            evaluations_db[(evaluations)]
            profiles_db[(profiles)]
            periods_db[(evaluation_periods)]
        end
        Prisma --> PostgreSQL
    end
```

### 2.2 Component Architecture

```mermaid
flowchart TB
    subgraph FRONTEND["FRONTEND (React)"]
        subgraph Pages
            AuthPage["Auth"]
            AuthCallback["AuthCallback"]
            Dashboard["Dashboard"]
            Assessment["Assessment"]
            History["History"]
            Profile["Profile"]
            NotFound["NotFound"]
            subgraph Admin
                AdminStaff["Staff"]
                AdminGroups["Groups"]
                AdminQuestions["Questions"]
                AdminPeriods["Periods"]
                AdminResults["Results"]
                AdminCharts["Charts"]
                AdminRoles["Roles"]
            end
        end
        subgraph Components
            AppSidebar["AppSidebar"]
            MainLayout["MainLayout"]
            NavLink["NavLink"]
            ProtectedRoute["ProtectedRoute"]
            UI["ui/ (shadcn)"]
        end
        subgraph Hooks
            useAuth["useAuth"]
            useStaff["useStaff"]
            useToast["useToast"]
            useMobile["useMobile"]
        end
        State["State: TanStack Query"]
        APIClient["API Client (Fetch)"]
    end
    
    APIClient --> BACKEND
    
    subgraph BACKEND["BACKEND (NestJS)"]
        subgraph Controllers
            AuthController["AuthController"]
            StaffController["StaffController"]
            GroupsController["GroupsController"]
            QuestionsController["QuestionsController"]
            EvaluationsController["EvaluationsController"]
            PeriodsController["EvaluationPeriodsController"]
            OrgUnitsController["OrganizationUnitsController"]
            UsersController["UsersController"]
        end
        subgraph Services
            AuthService["AuthService"]
            MSOAuthService["MicrosoftOAuthService"]
            StaffService["StaffService"]
            GroupsService["GroupsService"]
            QuestionsService["QuestionsService"]
            EvaluationsService["EvaluationsService"]
            PeriodsService["EvaluationPeriodsService"]
            OrgUnitsService["OrganizationUnitsService"]
            UsersService["UsersService"]
        end
        subgraph Guards
            JwtAuthGuard["JwtAuthGuard"]
            RolesGuard["RolesGuard"]
        end
        subgraph Decorators
            CurrentUser["@CurrentUser"]
            Roles["@Roles"]
        end
        PrismaService["Prisma Service"]
    end
```

### 2.3 Deployment Architecture (Local Development)

```mermaid
flowchart TB
    subgraph DevEnv["Development Environment"]
        Frontend["Frontend<br/>(Vite)<br/>Port: 8080"]
        Backend["Backend<br/>(NestJS)<br/>Port: 3001"]
        PostgreSQL[("PostgreSQL<br/>Port: 5432")]
        
        Frontend <--> Backend
        Backend --> PostgreSQL
    end
```

---

## 3. Use Cases

| Actor | Description |
|-------|-------------|
| **Guest** | Unauthenticated user, can only access login/register |
| **User** | Authenticated staff member, can evaluate peers and view own results |
| **Moderator** | Can view reports for their groups |
| **Admin** | Full system access, manages all entities and evaluation periods |

### 3.1 Use Case Details

#### UC-01: User Authentication

| Field | Description |
|-------|-------------|
| **Actor** | Guest |
| **Precondition** | User has valid credentials or Microsoft account |
| **Main Flow** | 1. User enters email/password or uses Microsoft login<br>2. System validates credentials<br>3. System issues JWT tokens<br>4. User redirected to dashboard |
| **Alt Flow** | Invalid credentials → Show error message |
| **Postcondition** | User authenticated with session |

#### UC-02: Submit Peer Evaluation

| Field | Description |
|-------|-------------|
| **Actor** | User |
| **Precondition** | User is authenticated, belongs to a group, and an active evaluation period exists |
| **Main Flow** | 1. User selects a group<br>2. User selects a colleague from the group<br>3. System displays evaluation questions<br>4. User rates colleague on each question (0-4 scale)<br>5. User submits evaluation<br>6. System saves evaluation |
| **Alt Flow** | User already evaluated → Load existing scores for editing |
| **Postcondition** | Evaluation stored in database for the active period |

#### UC-03: Manage Evaluation Periods

| Field | Description |
|-------|-------------|
| **Actor** | Admin |
| **Precondition** | Admin is authenticated |
| **Main Flow** | 1. Admin creates a new evaluation period with name, start/end dates<br>2. Admin activates the period (auto-deactivates others)<br>3. Staff can submit evaluations during active period<br>4. Admin closes the period when done |
| **Postcondition** | Only one period can be active at a time |

#### UC-04: View Results & Radar Charts

| Field | Description |
|-------|-------------|
| **Actor** | Admin |
| **Precondition** | Period has evaluations |
| **Main Flow** | 1. Admin selects an evaluation period<br>2. System displays ranking table with average scores per question<br>3. Admin clicks a staff member to view radar chart<br>4. Admin can export results to CSV |
| **Postcondition** | Report displayed/exported |

---

## 4. System Flows

### 4.1 Authentication Flow

```mermaid
sequenceDiagram
    participant Client
    participant NestJS
    participant Prisma
    participant PostgreSQL
    
    Client->>NestJS: POST /auth/login<br/>{email, password}
    NestJS->>Prisma: findUnique(email)
    Prisma->>PostgreSQL: SELECT profile
    PostgreSQL-->>Prisma: profile data
    Prisma-->>NestJS: profile + roles
    Note over NestJS: Verify password<br/>(Argon2id)
    Note over NestJS: Generate tokens<br/>(JWT)
    NestJS-->>Client: {accessToken,<br/>refreshToken,<br/>user}
    Note over Client: Store tokens<br/>(localStorage)
```

### 4.2 Peer Evaluation Flow

```mermaid
sequenceDiagram
    participant Client
    participant NestJS
    participant Prisma
    participant PostgreSQL
    
    Client->>NestJS: GET /evaluations/my-groups (with JWT)
    Note over NestJS: Validate JWT<br/>Extract staffId
    NestJS->>Prisma: Find user groups
    Prisma-->>NestJS: groups data
    NestJS-->>Client: [groups]
    
    Note over Client: User selects<br/>group & colleague
    
    Client->>NestJS: GET /questions
    NestJS-->>Client: [questions]
    
    Client->>NestJS: GET /evaluations/my?groupId=X&periodId=Y
    NestJS-->>Client: [existing evals]
    
    Note over Client: User fills scores<br/>for each question (0-4)
    
    Client->>NestJS: POST /evaluations/bulk<br/>{groupId, evaluateeId,<br/>periodId, evaluations:{}}
    Note over NestJS: Validate:<br/>- Not self-eval<br/>- Same group<br/>- Active period<br/>- Valid points (0-4)
    NestJS->>Prisma: Upsert evaluations
    Prisma-->>NestJS: success
    NestJS-->>Client: [evaluations]
```

### 4.3 User Journey Flow

```mermaid
flowchart TB
    Login["Login<br/>(Email/Password or Microsoft)"] --> Dashboard["Dashboard<br/>(Overview + Stats + Score)"]
    
    Dashboard --> Assessment["Assessment<br/>(Evaluate)"]
    Dashboard --> History["History<br/>(Received + Given)"]
    Dashboard --> Profile["Profile<br/>(View/Edit)"]
    Dashboard --> AdminPanel["Admin Panel<br/>(Admin only)"]
    
    Assessment --> SelectGroup["Select Group"]
    SelectGroup --> SelectColleague["Select Colleague"]
    SelectColleague --> RateQuestions["Rate Questions<br/>(0-4 scale)"]
    RateQuestions --> Submit["Submit & Confirm"]
    
    AdminPanel --> ManageStaff["Manage Staff"]
    AdminPanel --> ManageGroups["Manage Groups"]
    AdminPanel --> ManagePeriods["Manage Periods"]
    AdminPanel --> ManageQuestions["Manage Questions"]
    AdminPanel --> ViewResults["Results<br/>+ Radar Charts<br/>+ CSV Export"]
    AdminPanel --> ViewCharts["Charts<br/>+ Bar/Pie"]
    AdminPanel --> ManageRoles["Manage Roles"]
```

---

## 5. Database Design

### 5.1 Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    users ||--o| profiles : "has"
    users ||--o{ user_roles : "has"
    profiles |o--o| staff : "links to"
    
    organizationunits ||--o{ staff : "has"
    organizationunits ||--o{ groups : "contains"
    
    staff ||--o{ staff2groups : "belongs to"
    staff ||--o{ evaluations : "reviews (as reviewer)"
    staff ||--o{ evaluations : "receives (as evaluatee)"
    
    groups ||--o{ staff2groups : "has members"
    groups ||--o{ evaluations : "context for"
    groups ||--o{ subjects : "has"
    
    questions ||--o{ evaluations : "criterion for"
    evaluation_periods ||--o{ evaluations : "belongs to"
    
    users {
        UUID id PK
        VARCHAR email UK
        VARCHAR password_hash
        VARCHAR provider
        VARCHAR microsoft_id UK
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }
    
    profiles {
        UUID id PK
        UUID user_id FK_UK
        INT staff_id FK_UK
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }
    
    user_roles {
        UUID id PK
        UUID user_id FK
        ENUM role
        TIMESTAMP created_at
    }
    
    organizationunits {
        SERIAL id PK
        VARCHAR name UK
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }
    
    staff {
        SERIAL id PK
        VARCHAR name "NOT NULL"
        VARCHAR staffcode "UNIQUE NOT NULL"
        VARCHAR emails "UNIQUE"
        VARCHAR emailh
        ENUM sex
        DATE birthday
        VARCHAR mobile
        VARCHAR academicdegree
        VARCHAR academicrank
        VARCHAR position
        BOOLEAN is_party_member
        VARCHAR bidv
        INT organizationunitid FK
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }
    
    groups {
        SERIAL id PK
        VARCHAR name
        INT organizationunitid FK
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }
    
    staff2groups {
        SERIAL id PK
        INT staffid FK
        INT groupid FK
    }
    
    questions {
        SERIAL id PK
        VARCHAR title
        VARCHAR description
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }
    
    subjects {
        SERIAL id PK
        VARCHAR subjectid
        VARCHAR name
        INT groupid FK
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }
    
    evaluation_periods {
        SERIAL id PK
        VARCHAR name
        VARCHAR description
        DATE start_date
        DATE end_date
        ENUM status
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }
    
    evaluations {
        SERIAL id PK
        INT reviewerid FK
        INT evaluatee_id FK
        INT questionid FK
        INT groupid FK
        INT periodid FK
        DOUBLE point "NOT NULL DEFAULT 0"
        TIMESTAMP created_at
        TIMESTAMP modifieddate
    }
```

### 5.2 Key Constraints

| Constraint | Type | Description |
|---|---|---|
| `staff.staffcode` | UNIQUE | Mã giảng viên duy nhất |
| `staff.emails` | UNIQUE | Email trường duy nhất |
| `organizationunits.name` | UNIQUE | Tên khoa duy nhất |
| `staff2groups(staffid, groupid)` | UNIQUE | Không trùng nhóm |
| `evaluations(reviewerid, evaluatee_id, groupid, questionid, periodid)` | UNIQUE | Mỗi reviewer chỉ đánh giá 1 lần/câu hỏi/người/nhóm/kỳ |
| `user_roles(userId, role)` | UNIQUE | Mỗi user 1 role/loại |

### 5.3 Indexes

```sql
-- Single-column indexes
CREATE INDEX idx_staff_organizationunitid ON staff(organizationunitid);
CREATE INDEX idx_groups_organizationunitid ON groups(organizationunitid);
CREATE INDEX idx_staff2groups_staffid ON staff2groups(staffid);
CREATE INDEX idx_staff2groups_groupid ON staff2groups(groupid);
CREATE INDEX idx_evaluations_reviewerid ON evaluations(reviewerid);
CREATE INDEX idx_evaluations_evaluateeid ON evaluations(evaluatee_id);
CREATE INDEX idx_evaluations_groupid ON evaluations(groupid);
CREATE INDEX idx_evaluations_questionid ON evaluations(questionid);
CREATE INDEX idx_evaluations_periodid ON evaluations(periodid);

-- Composite indexes for common query patterns
CREATE INDEX idx_evaluations_reviewer_period ON evaluations(reviewerid, periodid);
CREATE INDEX idx_evaluations_evaluatee_period ON evaluations(evaluatee_id, periodid);
CREATE INDEX idx_evaluations_evaluatee_group_period ON evaluations(evaluatee_id, groupid, periodid);
```

---

## 6. API Design

### 6.1 API Endpoints Summary

#### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register new user | Public |
| POST | `/auth/login` | Login with email/password | Public |
| POST | `/auth/refresh` | Refresh tokens | Public |
| GET | `/auth/me` | Get current user | JWT |
| GET | `/auth/microsoft` | Redirect to Microsoft login | Public |
| GET | `/auth/microsoft/callback` | Microsoft OAuth callback | Public |
| POST | `/auth/microsoft/token` | Exchange one-time code for JWT | Public |

#### Organization Units

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/organization-units` | List all | JWT |
| GET | `/organization-units/:id` | Get by ID | JWT |
| POST | `/organization-units` | Create | Admin |
| PATCH | `/organization-units/:id` | Update | Admin |
| DELETE | `/organization-units/:id` | Delete | Admin |

#### Staff

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/staff` | List all staff | JWT |
| GET | `/staff/:id` | Get by ID | JWT |
| POST | `/staff` | Create (name, staffcode required) | Admin |
| PATCH | `/staff/:id` | Update (partial) | Admin |
| DELETE | `/staff/:id` | Delete | Admin |

#### Groups

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/groups` | List all | JWT |
| GET | `/groups/:id` | Get by ID | JWT |
| GET | `/groups/:id/members` | Get group members | JWT |
| POST | `/groups` | Create | Admin |
| PATCH | `/groups/:id` | Update | Admin |
| PUT | `/groups/:id/members` | Update members | Admin/Mod |
| DELETE | `/groups/:id` | Delete | Admin |

#### Evaluation Periods

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/evaluation-periods` | List all periods | JWT |
| GET | `/evaluation-periods/active` | Get active periods | JWT |
| POST | `/evaluation-periods` | Create new period | Admin |
| PATCH | `/evaluation-periods/:id` | Update (auto-deactivates others if activating) | Admin |
| DELETE | `/evaluation-periods/:id` | Delete period | Admin |

#### Evaluations

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/evaluations` | All evaluations (filtered) | Admin/Mod |
| GET | `/evaluations/my` | My given evaluations | JWT |
| GET | `/evaluations/received` | My received evaluations | JWT |
| GET | `/evaluations/my-groups` | My groups | JWT |
| GET | `/evaluations/colleagues/:groupId` | Colleagues in group | JWT |
| GET | `/evaluations/staff2groups` | Staff-to-groups mapping | Admin/Mod |
| POST | `/evaluations/bulk` | Submit bulk evaluation | JWT |

#### Questions

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/questions` | List all questions | JWT |
| POST | `/questions` | Create question | Admin |
| PATCH | `/questions/:id` | Update question | Admin |
| DELETE | `/questions/:id` | Delete question | Admin |

#### Users

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/users/profiles` | List all user profiles | Admin |
| GET | `/users/profile` | Get my profile | JWT |
| POST | `/users/link-staff` | Link user to staff | Admin |
| GET | `/users/roles` | Get users with roles | Admin |
| POST | `/users/:userId/roles` | Add role to user | Admin |
| DELETE | `/users/:userId/roles/:role` | Remove role | Admin |

### 6.2 Request/Response Examples

#### Login

**Request:**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "staffId": 42,
    "roles": ["user"]
  }
}
```

#### Submit Bulk Evaluation

**Request:**
```http
POST /evaluations/bulk
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "groupId": 1,
  "evaluateeId": 5,
  "periodId": 1,
  "evaluations": {
    "1": 3.5,
    "2": 4.0,
    "3": 3.0
  }
}
```

**Response:**
```json
[
  { "id": 10, "reviewerid": 2, "evaluateeid": 5, "questionid": 1, "groupid": 1, "periodid": 1, "point": 3.5 },
  { "id": 11, "reviewerid": 2, "evaluateeid": 5, "questionid": 2, "groupid": 1, "periodid": 1, "point": 4.0 },
  { "id": 12, "reviewerid": 2, "evaluateeid": 5, "questionid": 3, "groupid": 1, "periodid": 1, "point": 3.0 }
]
```

---

## 7. Security Design

### 7.1 Authentication

- **Method:** JWT (JSON Web Tokens) + Microsoft OAuth 2.0
- **Access Token:** 15 minutes expiry
- **Refresh Token:** 7 days expiry
- **Password Hashing:** Argon2id (memory-hard, side-channel resistant)

### 7.2 Authorization

| Role | Permissions |
|------|-------------|
| **user** | View own groups, submit evaluations, view own scores, view evaluation history |
| **moderator** | user + view group reports and charts |
| **admin** | moderator + full CRUD on all entities, manage evaluation periods, export CSV |

### 7.3 Security Measures

| Measure | Implementation |
|---------|----------------|
| **Rate Limiting** | NestJS Throttler (100 req/min) |
| **CORS** | Whitelist frontend origins only |
| **Input Validation** | class-validator DTOs with strict typing |
| **SQL Injection** | Prisma parameterized queries |
| **XSS** | React auto-escaping + CSP headers |
| **HTTPS** | Required in production |

### 7.4 Data Protection

- Self-evaluation prevention (`reviewerId ≠ evaluateeId`)
- Group membership validation before evaluation
- Active period validation before submission
- Point range validation (0-4, server-side)
- Single active period enforcement (auto-deactivation)
- Composite unique constraint prevents duplicate evaluations

---

## Appendix

### A. Glossary

| Term | Definition |
|------|------------|
| **Staff** | Faculty member (Giảng viên) |
| **Group** | Collection of staff who evaluate each other (Nhóm đánh giá) |
| **Question** | Evaluation criterion (e.g., "Tinh thần trách nhiệm") |
| **Evaluation** | Single score given by reviewer to evaluatee on a question |
| **Reviewer** | Staff member giving the evaluation |
| **Evaluatee** | Staff member receiving the evaluation |
| **Evaluation Period** | Time-bound evaluation cycle (Đợt đánh giá) |
| **Organization Unit** | Department or faculty (Khoa) |

### B. Vietnamese Field Mapping

| English | Vietnamese |
|---------|------------|
| Organization Unit | Khoa |
| Staff | Giảng viên |
| Group | Nhóm đánh giá |
| Evaluation | Đánh giá |
| Evaluation Period | Đợt đánh giá |
| Question | Tiêu chí đánh giá |
| Academic Degree | Học vị (ThS, TS) |
| Academic Rank | Học hàm (PGS, GS) |
| Dashboard | Tổng quan |
| Assessment | Đánh giá đồng nghiệp |
| History | Tra cứu |
| Results | Kết quả |
