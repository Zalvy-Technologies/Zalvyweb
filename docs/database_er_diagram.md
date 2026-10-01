# Zalvy Production Database Architecture & ER Diagram

This document details the production relational database design for the **Zalvy Platform**.

---

## 1. Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    users ||--o{ company_members : "belongs to / manages"
    users ||--o{ internships : "creates"
    users ||--o{ applications : "submits"
    users ||--o{ certificates : "receives"
    users ||--o{ projects : "showcases"
    users ||--o{ verification_tokens : "requests"
    users ||--o{ notifications : "receives"

    companies ||--o{ company_members : "has members"
    companies ||--o{ internships : "posts"
    companies ||--o{ certificates : "issues"
    companies ||--o{ verification_tokens : "verifies domain"

    internships ||--o{ applications : "receives"
    internships ||--o{ certificates : "awards"

    applications }o--|| users : "reviewed by"

    admins ||--o{ blog_posts : "authors"

    blog_posts ||--o{ blog_post_tags : "has"
    blog_tags ||--o{ blog_post_tags : "categorizes"

    users {
        uuid id PK
        string email UK
        string password_hash
        string first_name
        string last_name
        user_role role
        user_status status
        boolean is_email_verified
        timestamp created_at
    }

    admins {
        uuid id PK
        string email UK
        string password_hash
        admin_role role
        jsonb permissions
        boolean is_active
        timestamp created_at
    }

    companies {
        uuid id PK
        string name
        string slug UK
        string domain
        company_size company_size
        company_verification_status verification_status
        timestamp created_at
    }

    company_members {
        uuid id PK
        uuid company_id FK
        uuid user_id FK
        company_member_role role
        timestamp created_at
    }

    internships {
        uuid id PK
        uuid company_id FK
        uuid created_by_user_id FK
        string title
        string slug UK
        location_type location_type
        numeric stipend_amount
        timestamp application_deadline
        internship_status status
        timestamp created_at
    }

    applications {
        uuid id PK
        uuid internship_id FK
        uuid applicant_id FK
        string resume_snapshot_url
        jsonb custom_answers
        application_status status
        uuid reviewed_by_user_id FK
        timestamp created_at
    }

    certificates {
        uuid id PK
        string certificate_number UK
        string verification_hash UK
        uuid recipient_id FK
        uuid issuer_company_id FK
        uuid internship_id FK
        certificate_status status
        date issue_date
        timestamp created_at
    }

    projects {
        uuid id PK
        uuid user_id FK
        string title
        string slug
        string_array tech_stack
        boolean is_featured
        timestamp created_at
    }

    blog_posts {
        uuid id PK
        uuid author_admin_id FK
        string title
        string slug UK
        blog_status status
        timestamp published_at
        timestamp created_at
    }

    blog_tags {
        uuid id PK
        string name UK
        string slug UK
    }

    blog_post_tags {
        uuid post_id PK, FK
        uuid tag_id PK, FK
    }

    verification_tokens {
        uuid id PK
        string token_hash UK
        token_type type
        uuid user_id FK
        uuid company_id FK
        timestamp expires_at
        timestamp used_at
    }

    notifications {
        uuid id PK
        uuid user_id FK
        string title
        notification_channel channel
        jsonb payload
        boolean is_read
        timestamp created_at
    }

    emails_log {
        uuid id PK
        string recipient_email
        string subject
        email_status status
        int retry_count
        timestamp created_at
    }

    audit_logs {
        uuid id PK
        uuid actor_id
        string actor_type
        string action
        string entity_type
        uuid entity_id
        inet ip_address
        jsonb changes
        timestamp created_at
    }
```

---

## 2. Key Design Principles

### Primary Keys & Data Types

- **UUID v4**: Primary keys on all tables utilize `gen_random_uuid()` for distributed security and prevent sequential enumeration attacks.
- **TIMESTAMPTZ**: All timestamp columns use `TIMESTAMPTZ` (UTC storage) for time-zone invariance across microservices.
- **JSONB**: Utilized for dynamic parameters (audit changes diff, notification payload, custom application answers, admin granular permissions).

### Referential Integrity & Cascades

- **`ON DELETE CASCADE`**: Applied to tightly coupled dependent entities:
  - `company_members` -> `companies` / `users`
  - `applications` -> `internships` / `users`
  - `projects` -> `users`
  - `notifications` -> `users`
- **`ON DELETE RESTRICT`**: Applied to preserve business transaction histories:
  - `internships` -> `companies` / `users` (Deleting a company or creator user will be blocked if active internships exist).
  - `blog_posts` -> `admins`
- **`ON DELETE SET NULL`**: Applied to non-critical relationships:
  - `certificates` -> `companies` / `internships` (Certificate remains valid for the student even if the issuing entity is removed).

### Constraints & Indexes

1. **Uniqueness Constraints**:
   - `users(email)`
   - `companies(slug)`
   - `internships(slug)`
   - `applications(internship_id, applicant_id)` (Prevents duplicate applications)
   - `certificates(certificate_number)` and `certificates(verification_hash)`
   - `projects(user_id, slug)`
   - `blog_posts(slug)`
2. **Domain Check Constraints**:
   - Email regex format enforcement on `users` & `admins`.
   - `stipend_amount >= 0`, `duration_months > 0`, `openings_count > 0` on `internships`.
3. **Optimized Performance Indexes**:
   - **Composite B-Tree Indexes**: `internships(status, location_type, application_deadline)` for fast search queries.
   - **Partial Indexes**: `verification_tokens(token_hash) WHERE used_at IS NULL AND expires_at > CURRENT_TIMESTAMP` for ultra-fast OTP lookups.
   - **GIN Indexes**: `audit_logs.changes`, `notifications.payload`, `applications.custom_answers` for fast JSON searching.
