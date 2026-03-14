# Staff Evaluation System - ERD

## Entity Relationship Diagram

```mermaid
erDiagram
    %% ===== ENUMS =====
    %% AppRole: admin | moderator | user
    %% Gender: male | female
    %% PeriodStatus: draft | active | closed

    %% ===== AUTH DOMAIN =====
    users {
        UUID id PK
        VARCHAR email UK "unique"
        VARCHAR password_hash
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    profiles {
        UUID id PK
        UUID user_id FK,UK "unique"
        INT staff_id FK,UK "unique, nullable"
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    user_roles {
        UUID id PK
        UUID user_id FK
        AppRole role "admin | moderator | user"
        TIMESTAMP created_at
    }

    %% ===== ORGANIZATION DOMAIN =====
    organizationunits {
        SERIAL id PK
        VARCHAR name
    }

    staff {
        SERIAL id PK
        VARCHAR name "nullable"
        VARCHAR emailh "home email, nullable"
        VARCHAR emails "school email, nullable"
        VARCHAR staffcode UK "unique, nullable"
        Gender sex "male | female, nullable"
        TIMESTAMP birthday "nullable"
        VARCHAR mobile "nullable"
        VARCHAR academicrank "nullable"
        VARCHAR academicdegree "nullable"
        INT organizationunitid FK "nullable"
        VARCHAR bidv "bank account, nullable"
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    groups {
        SERIAL id PK
        VARCHAR name
        INT organizationunitid FK "nullable"
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    staff2groups {
        SERIAL id PK
        INT staffid FK
        INT groupid FK
    }

    subjects {
        SERIAL id PK
        VARCHAR subjectid "nullable"
        VARCHAR name "nullable"
        INT groupid FK "nullable"
    }

    %% ===== EVALUATION DOMAIN =====
    questions {
        SERIAL id PK
        VARCHAR title
        VARCHAR description "nullable"
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    evaluation_periods {
        SERIAL id PK
        VARCHAR name
        VARCHAR description "nullable"
        TIMESTAMP start_date
        TIMESTAMP end_date
        PeriodStatus status "draft | active | closed"
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    evaluations {
        SERIAL id PK
        INT reviewerid FK "staff who reviews"
        INT victimid FK "staff being evaluated"
        INT groupid FK
        INT questionid FK
        INT periodid FK
        FLOAT point "nullable, 0-10"
        TIMESTAMP created_at
        TIMESTAMP modifieddate
    }

    %% ===== RELATIONSHIPS =====

    %% Auth
    users ||--o| profiles : "has"
    users ||--o{ user_roles : "has"

    %% Profile links auth to staff
    profiles |o--o| staff : "links to"

    %% Organization hierarchy
    organizationunits ||--o{ staff : "contains"
    organizationunits ||--o{ groups : "contains"

    %% Staff <-> Group (M:N via junction)
    staff ||--o{ staff2groups : "belongs to"
    groups ||--o{ staff2groups : "has members"

    %% Group -> Subject
    groups ||--o{ subjects : "has"

    %% Evaluation relationships
    staff ||--o{ evaluations : "gives (reviewer)"
    staff ||--o{ evaluations : "receives (evaluatee)"
    groups ||--o{ evaluations : "context"
    questions ||--o{ evaluations : "criteria"
    evaluation_periods ||--o{ evaluations : "belongs to"
```

## Unique Constraints

| Table | Constraint | Columns |
|-------|-----------|---------|
| `users` | UK | `email` |
| `profiles` | UK | `user_id` |
| `profiles` | UK | `staff_id` |
| `user_roles` | UK | `(user_id, role)` |
| `staff` | UK | `staffcode` |
| `staff2groups` | UK | `(staffid, groupid)` |
| `evaluations` | UK | `(reviewerid, victimid, groupid, questionid, periodid)` |

## Cascade Delete Behavior

| Parent | Child | On Delete |
|--------|-------|-----------|
| `users` | `profiles` | CASCADE |
| `users` | `user_roles` | CASCADE |
| `staff` | `staff2groups` | CASCADE |
| `groups` | `staff2groups` | CASCADE |
| `staff` (reviewer) | `evaluations` | CASCADE |
| `staff` (evaluatee) | `evaluations` | CASCADE |
| `groups` | `evaluations` | CASCADE |
| `questions` | `evaluations` | CASCADE |
| `evaluation_periods` | `evaluations` | CASCADE |

## Indexes

| Table | Indexed Columns |
|-------|----------------|
| `staff` | `organizationunitid`, `staffcode` (unique) |
| `groups` | `organizationunitid` |
| `staff2groups` | `staffid`, `groupid` |
| `evaluations` | `reviewerid`, `evaluateeid`, `groupid`, `questionid`, `periodid` |

## Data Flow

```mermaid
flowchart LR
    subgraph Auth["Authentication"]
        U[User] --> P[Profile]
        U --> UR[UserRole]
    end

    subgraph Org["Organization"]
        OU[OrganizationUnit] --> S[Staff]
        OU --> G[Group]
        S <-->|M:N via Staff2Group| G
        G --> Sub[Subject]
    end

    subgraph Eval["Evaluation"]
        EP[EvaluationPeriod]
        Q[Question]
        E[Evaluation]
    end

    P -.->|links| S
    S -->|reviewer| E
    S -->|evaluatee| E
    G --> E
    Q --> E
    EP --> E
```
