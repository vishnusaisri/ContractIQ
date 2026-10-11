-- ContractIQ Enterprise Multi-Tenant Database Schema

CREATE TABLE IF NOT EXISTS organizations (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    company_size VARCHAR(50),
    plan VARCHAR(50) DEFAULT 'Starter',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    organization_id VARCHAR(36) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'member', -- owner, admin, legal, manager, member, viewer
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contracts (
    id VARCHAR(36) PRIMARY KEY,
    organization_id VARCHAR(36) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    uploaded_by VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    contract_name VARCHAR(255) NOT NULL,
    contract_type VARCHAR(100),
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500),
    status VARCHAR(50) DEFAULT 'COMPLETED', -- UPLOADED, EXTRACTING, ANALYZING, RISK_ANALYSIS, COMPLETED, FAILED
    start_date DATE,
    end_date DATE,
    renewal_date DATE,
    renewal_type VARCHAR(50), -- auto, manual, none
    notice_period_days INTEGER,
    contract_value NUMERIC(15, 2),
    currency VARCHAR(10) DEFAULT 'INR',
    risk_score INTEGER DEFAULT 0,
    risk_level VARCHAR(20) DEFAULT 'LOW', -- LOW, MEDIUM, HIGH, CRITICAL
    summary TEXT,
    raw_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clauses (
    id VARCHAR(36) PRIMARY KEY,
    contract_id VARCHAR(36) NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
    clause_type VARCHAR(100) NOT NULL, -- payment, termination, renewal, liability, indemnification, etc.
    clause_text TEXT NOT NULL,
    page_number INTEGER,
    risk_level VARCHAR(20) DEFAULT 'LOW',
    risk_score INTEGER DEFAULT 0,
    explanation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS obligations (
    id VARCHAR(36) PRIMARY KEY,
    contract_id VARCHAR(36) NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
    responsible_party VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    due_date DATE,
    frequency VARCHAR(50), -- One-time, Monthly, Quarterly, Annual
    status VARCHAR(50) DEFAULT 'Pending', -- Pending, In Progress, Completed, Overdue
    priority VARCHAR(20) DEFAULT 'Medium', -- Low, Medium, High, Critical
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS alerts (
    id VARCHAR(36) PRIMARY KEY,
    organization_id VARCHAR(36) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    contract_id VARCHAR(36) REFERENCES contracts(id) ON DELETE CASCADE,
    alert_type VARCHAR(50) NOT NULL, -- renewal, expiration, notice_deadline, obligation_due, high_risk, custom
    alert_date DATE NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'unread', -- unread, read, resolved
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(36) PRIMARY KEY,
    organization_id VARCHAR(36) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(36),
    metadata TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Multi-Tenant Indexes for fast tenant-isolated queries
CREATE INDEX IF NOT EXISTS idx_users_org ON users(organization_id);
CREATE INDEX IF NOT EXISTS idx_contracts_org ON contracts(organization_id);
CREATE INDEX IF NOT EXISTS idx_clauses_contract ON clauses(contract_id);
CREATE INDEX IF NOT EXISTS idx_obligations_contract ON obligations(contract_id);
CREATE INDEX IF NOT EXISTS idx_alerts_org ON alerts(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_org ON audit_logs(organization_id);
