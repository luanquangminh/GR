# Staff Evaluation System — ERD

Generated from `staffEvaluation-api/prisma/schema.prisma`.

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
        VARCHAR email UK
        VARCHAR password_hash "nullable (OAuth users)"
        VARCHAR provider "local | microsoft"
        VARCHAR microsoft_id UK "nullable"
        INT token_version "refresh invalidation"
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    profiles {
        UUID id PK
        UUID user_id FK,UK
        INT staff_id FK,UK "nullable — links to Staff"
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
        VARCHAR name UK
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    staff {
        SERIAL id PK
        VARCHAR name
        VARCHAR emailh "home email, nullable"
        VARCHAR emails UK "school email, nullable"
        VARCHAR staffcode UK
        Gender sex "nullable"
        TIMESTAMP birthday "nullable"
        VARCHAR mobile "nullable"
        VARCHAR academicrank "nullable"
        VARCHAR academicdegree "nullable"
        VARCHAR position "nullable"
        BOOL is_party_member "default false"
        INT organizationunitid FK "nullable"
        VARCHAR avatar "nullable — uploaded path"
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
        TIMESTAMP created_at
        TIMESTAMP updated_at
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
        INT evaluatee_id FK "staff being evaluated"
        INT groupid FK
        INT questionid FK
        INT periodid FK
        FLOAT point "0-4, default 0"
        TIMESTAMP created_at
        TIMESTAMP modifieddate
    }

    %% ===== RELATIONSHIPS =====

    %% Auth
    users ||--o| profiles : "has 0..1"
    users ||--o{ user_roles : "has many"

    %% Profile links auth user to staff record
    profiles |o--o| staff : "links 0..1"

    %% Organization hierarchy
    organizationunits ||--o{ staff : "contains"
    organizationunits ||--o{ groups : "contains"

    %% Staff <-> Group (M:N via junction)
    staff ||--o{ staff2groups : "member of"
    groups ||--o{ staff2groups : "has members"

    %% Group -> Subject
    groups ||--o{ subjects : "has"

    %% Evaluation relationships
    staff ||--o{ evaluations : "gives (reviewer)"
    staff ||--o{ evaluations : "receives (evaluatee)"
    groups ||--o{ evaluations : "scoped by"
    questions ||--o{ evaluations : "criterion for"
    evaluation_periods ||--o{ evaluations : "within"
```

## Unique Constraints

| Table | Columns |
|-------|---------|
| `users` | `email` |
| `users` | `microsoft_id` |
| `profiles` | `user_id` |
| `profiles` | `staff_id` |
| `user_roles` | `(user_id, role)` |
| `organizationunits` | `name` |
| `staff` | `staffcode` |
| `staff` | `emails` (school email) |
| `staff2groups` | `(staffid, groupid)` |
| `evaluations` | `(reviewerid, evaluatee_id, groupid, questionid, periodid)` |

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
| `organizationunits` | `staff.organizationunitid` | SET NULL |
| `organizationunits` | `groups.organizationunitid` | SET NULL |
| `staff` | `profiles.staff_id` | default (no cascade) |

## Indexes

| Table | Indexed Columns |
|-------|----------------|
| `staff` | `organizationunitid` |
| `groups` | `organizationunitid` |
| `staff2groups` | `staffid`, `groupid` |
| `evaluations` | `reviewerid`, `evaluatee_id`, `groupid`, `questionid`, `periodid` |
| `evaluations` (composite) | `(reviewerid, periodid)`, `(evaluatee_id, periodid)`, `(evaluatee_id, groupid, periodid)` |

## Domain Data Flow

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

    P -.->|links 0..1| S
    S -->|reviewer| E
    S -->|evaluatee| E
    G --> E
    Q --> E
    EP --> E
```

## Notes

- `User.provider = 'microsoft'` means the user authenticated via Microsoft OAuth; `password_hash` is null in that case.
- `Profile.staff_id` is the bridge between the auth identity (`User`) and the HR record (`Staff`). A user without a linked staff cannot submit evaluations (enforced in `EvaluationsController.ensureStaffLinked`).
- The composite unique constraint on `evaluations` ensures one score per (reviewer, evaluatee, group, question, period) — `bulkUpsert` relies on this for idempotency.
- `point` is validated at `0–4` by the DTO and service layer (`evaluations.service.ts`), although the column itself is an unrestricted `Float`.
- `Staff.emails` (school email) is unique; OAuth linking uses this field to auto-associate a Microsoft account with an existing Staff row.
