-- =============================================================================
-- Zalvy Platform - Enterprise Production Database Migration
-- Migration Script: 0001_initial_schema.sql
-- Target DBMS: PostgreSQL 15+
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- AUTOMATED TIMESTAMP FUNCTION
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------------------------------
-- ENUM TYPES DEFINITION
-- -----------------------------------------------------------------------------
CREATE TYPE user_role AS ENUM (
    'USER',
    'COMPANY_MEMBER',
    'ADMIN'
);

CREATE TYPE user_status AS ENUM (
    'PENDING_VERIFICATION',
    'ACTIVE',
    'SUSPENDED',
    'DELETED'
);

CREATE TYPE company_verification_status AS ENUM (
    'UNVERIFIED',
    'PENDING',
    'VERIFIED',
    'REJECTED'
);

CREATE TYPE company_size AS ENUM (
    'STARTUP_1_10',
    'SMALL_11_50',
    'MEDIUM_51_200',
    'LARGE_201_500',
    'ENTERPRISE_500_PLUS'
);

CREATE TYPE company_member_role AS ENUM (
    'OWNER',
    'RECRUITER',
    'MEMBER'
);

CREATE TYPE location_type AS ENUM (
    'REMOTE',
    'HYBRID',
    'ON_SITE'
);

CREATE TYPE internship_status AS ENUM (
    'DRAFT',
    'PUBLISHED',
    'CLOSED',
    'ARCHIVED'
);

CREATE TYPE application_status AS ENUM (
    'APPLIED',
    'UNDER_REVIEW',
    'SHORTLISTED',
    'INTERVIEWING',
    'ACCEPTED',
    'REJECTED',
    'WITHDRAWN'
);

CREATE TYPE certificate_status AS ENUM (
    'ISSUED',
    'REVOKED'
);

CREATE TYPE blog_status AS ENUM (
    'DRAFT',
    'PUBLISHED',
    'SCHEDULED',
    'ARCHIVED'
);

CREATE TYPE admin_role AS ENUM (
    'SUPER_ADMIN',
    'MODERATOR',
    'CONTENT_EDITOR',
    'SUPPORT_AGENT'
);

CREATE TYPE token_type AS ENUM (
    'EMAIL_VERIFICATION',
    'PASSWORD_RESET',
    'COMPANY_DOMAIN_VERIFICATION',
    'TWO_FACTOR'
);

CREATE TYPE notification_channel AS ENUM (
    'IN_APP',
    'EMAIL',
    'SMS',
    'PUSH'
);

CREATE TYPE email_status AS ENUM (
    'QUEUED',
    'PROCESSING',
    'SENT',
    'DELIVERED',
    'FAILED',
    'BOUNCED'
);

-- =============================================================================
-- 1. USERS TABLE
-- =============================================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    headline VARCHAR(255),
    bio TEXT,
    phone_number VARCHAR(30),
    resume_url TEXT,
    portfolio_url TEXT,
    github_url TEXT,
    linkedin_url TEXT,
    role user_role NOT NULL DEFAULT 'USER',
    status user_status NOT NULL DEFAULT 'PENDING_VERIFICATION',
    is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_users_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_role ON users(role);

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- 2. ADMINS TABLE
-- =============================================================================
CREATE TABLE admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role admin_role NOT NULL DEFAULT 'MODERATOR',
    permissions JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_admins_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE INDEX idx_admins_email ON users(email);
CREATE INDEX idx_admins_role ON admins(role);

CREATE TRIGGER trg_admins_updated_at
BEFORE UPDATE ON admins
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- 3. COMPANIES TABLE
-- =============================================================================
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    legal_name VARCHAR(255),
    tax_id VARCHAR(100),
    domain VARCHAR(255),
    logo_url TEXT,
    cover_image_url TEXT,
    website_url TEXT,
    description TEXT,
    industry VARCHAR(100),
    company_size company_size NOT NULL DEFAULT 'SMALL_11_50',
    verification_status company_verification_status NOT NULL DEFAULT 'UNVERIFIED',
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_companies_slug ON companies(slug);
CREATE INDEX idx_companies_verification_status ON companies(verification_status);
CREATE INDEX idx_companies_domain ON companies(domain);

CREATE TRIGGER trg_companies_updated_at
BEFORE UPDATE ON companies
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- 4. COMPANY MEMBERS TABLE (User <-> Company Mapping)
-- =============================================================================
CREATE TABLE company_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role company_member_role NOT NULL DEFAULT 'MEMBER',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_company_user UNIQUE (company_id, user_id)
);

CREATE INDEX idx_company_members_company_id ON company_members(company_id);
CREATE INDEX idx_company_members_user_id ON company_members(user_id);

CREATE TRIGGER trg_company_members_updated_at
BEFORE UPDATE ON company_members
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- 5. INTERNSHIPS TABLE
-- =============================================================================
CREATE TABLE internships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE RESTRICT,
    created_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    requirements TEXT[] NOT NULL DEFAULT '{}',
    responsibilities TEXT[] NOT NULL DEFAULT '{}',
    skills_required TEXT[] NOT NULL DEFAULT '{}',
    location VARCHAR(255),
    location_type location_type NOT NULL DEFAULT 'REMOTE',
    stipend_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    stipend_currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    duration_months INT NOT NULL DEFAULT 3,
    openings_count INT NOT NULL DEFAULT 1,
    application_deadline TIMESTAMPTZ NOT NULL,
    status internship_status NOT NULL DEFAULT 'DRAFT',
    views_count INT NOT NULL DEFAULT 0,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_positive_stipend CHECK (stipend_amount >= 0),
    CONSTRAINT check_positive_duration CHECK (duration_months > 0),
    CONSTRAINT check_positive_openings CHECK (openings_count > 0)
);

CREATE INDEX idx_internships_company_id ON internships(company_id);
CREATE INDEX idx_internships_status ON internships(status);
CREATE INDEX idx_internships_location_type ON internships(location_type);
CREATE INDEX idx_internships_deadline ON internships(application_deadline);
CREATE INDEX idx_internships_composite_search ON internships(status, location_type, application_deadline);

CREATE TRIGGER trg_internships_updated_at
BEFORE UPDATE ON internships
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- 6. APPLICATIONS TABLE
-- =============================================================================
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    internship_id UUID NOT NULL REFERENCES internships(id) ON DELETE CASCADE,
    applicant_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cover_letter TEXT,
    resume_snapshot_url TEXT NOT NULL,
    custom_answers JSONB NOT NULL DEFAULT '{}'::jsonb,
    status application_status NOT NULL DEFAULT 'APPLIED',
    reviewer_notes TEXT,
    reviewed_at TIMESTAMPTZ,
    reviewed_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_internship_applicant UNIQUE (internship_id, applicant_id)
);

CREATE INDEX idx_applications_internship_id ON applications(internship_id);
CREATE INDEX idx_applications_applicant_id ON applications(applicant_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_custom_answers_gin ON applications USING GIN (custom_answers);

CREATE TRIGGER trg_applications_updated_at
BEFORE UPDATE ON applications
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- 7. CERTIFICATES TABLE
-- =============================================================================
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    certificate_number VARCHAR(100) NOT NULL UNIQUE,
    verification_hash VARCHAR(255) NOT NULL UNIQUE,
    recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    issuer_company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    internship_id UUID REFERENCES internships(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expiration_date DATE,
    certificate_url TEXT NOT NULL,
    status certificate_status NOT NULL DEFAULT 'ISSUED',
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_certificates_recipient_id ON certificates(recipient_id);
CREATE INDEX idx_certificates_verification_hash ON certificates(verification_hash);
CREATE INDEX idx_certificates_number ON certificates(certificate_number);

CREATE TRIGGER trg_certificates_updated_at
BEFORE UPDATE ON certificates
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- 8. PROJECTS TABLE (User Showcase)
-- =============================================================================
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    tech_stack TEXT[] NOT NULL DEFAULT '{}',
    github_repository_url TEXT,
    live_demo_url TEXT,
    thumbnail_url TEXT,
    media_urls TEXT[] NOT NULL DEFAULT '{}',
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_user_project_slug UNIQUE (user_id, slug)
);

CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_featured ON projects(is_featured);

CREATE TRIGGER trg_projects_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- 9. BLOG POSTS & TAGS SYSTEM
-- =============================================================================
CREATE TABLE blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_admin_id UUID NOT NULL REFERENCES admins(id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image_url TEXT,
    status blog_status NOT NULL DEFAULT 'DRAFT',
    views_count INT NOT NULL DEFAULT 0,
    read_time_minutes INT NOT NULL DEFAULT 3,
    meta_title VARCHAR(255),
    meta_description TEXT,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_author ON blog_posts(author_admin_id);

CREATE TRIGGER trg_blog_posts_updated_at
BEFORE UPDATE ON blog_posts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE blog_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE blog_post_tags (
    post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES blog_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

-- =============================================================================
-- 10. VERIFICATION TOKENS TABLE
-- =============================================================================
CREATE TABLE verification_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    type token_type NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    payload JSONB DEFAULT '{}'::jsonb,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_verification_tokens_hash ON verification_tokens(token_hash);
CREATE INDEX idx_verification_tokens_user_id ON verification_tokens(user_id);
-- Partial Index for Active Unused Tokens
CREATE INDEX idx_verification_active_tokens 
ON verification_tokens(token_hash) 
WHERE used_at IS NULL AND expires_at > CURRENT_TIMESTAMP;

-- =============================================================================
-- 11. NOTIFICATIONS TABLE
-- =============================================================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    channel notification_channel NOT NULL DEFAULT 'IN_APP',
    action_url TEXT,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_notifications_payload_gin ON notifications USING GIN (payload);

-- =============================================================================
-- 12. EMAILS LOG TABLE
-- =============================================================================
CREATE TABLE emails_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    template_id VARCHAR(100) NOT NULL,
    variables JSONB NOT NULL DEFAULT '{}'::jsonb,
    status email_status NOT NULL DEFAULT 'QUEUED',
    provider_message_id VARCHAR(255),
    error_message TEXT,
    retry_count INT NOT NULL DEFAULT 0,
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_emails_log_recipient ON emails_log(recipient_email);
CREATE INDEX idx_emails_log_status ON emails_log(status);

CREATE TRIGGER trg_emails_log_updated_at
BEFORE UPDATE ON emails_log
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- 13. AUDIT LOGS TABLE
-- =============================================================================
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID, -- References user_id or admin_id
    actor_type VARCHAR(50) NOT NULL, -- 'USER', 'ADMIN', 'SYSTEM'
    action VARCHAR(100) NOT NULL, -- e.g. 'APPLICATION_SUBMITTED', 'ROLE_CHANGE', 'COMPANY_VERIFIED'
    entity_type VARCHAR(100) NOT NULL, -- e.g. 'users', 'companies', 'internships'
    entity_id UUID,
    ip_address INET,
    user_agent TEXT,
    changes JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_id, actor_type);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_changes_gin ON audit_logs USING GIN (changes);
