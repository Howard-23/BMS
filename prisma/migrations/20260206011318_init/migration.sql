-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "middle_name" TEXT,
    "last_name" TEXT NOT NULL,
    "suffix" TEXT,
    "role" TEXT NOT NULL DEFAULT 'STAFF',
    "position" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_login" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "residents" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "barangay_id" TEXT,
    "first_name" TEXT NOT NULL,
    "middle_name" TEXT,
    "last_name" TEXT NOT NULL,
    "suffix" TEXT,
    "birth_date" DATETIME NOT NULL,
    "birth_place" TEXT,
    "gender" TEXT NOT NULL,
    "civil_status" TEXT NOT NULL DEFAULT 'SINGLE',
    "blood_type" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT NOT NULL,
    "purok" TEXT,
    "philhealth_id" TEXT,
    "sss_id" TEXT,
    "gsis_id" TEXT,
    "tin" TEXT,
    "voters_id" TEXT,
    "is_voter" BOOLEAN NOT NULL DEFAULT false,
    "precinct_number" TEXT,
    "occupation" TEXT,
    "employment_status" TEXT,
    "monthly_income" DECIMAL,
    "educational_attainment" TEXT,
    "school_last_attended" TEXT,
    "mother_name" TEXT,
    "father_name" TEXT,
    "spouse_name" TEXT,
    "is_senior_citizen" BOOLEAN NOT NULL DEFAULT false,
    "is_pwd" BOOLEAN NOT NULL DEFAULT false,
    "is_solo_parent" BOOLEAN NOT NULL DEFAULT false,
    "is_indigent" BOOLEAN NOT NULL DEFAULT false,
    "emergency_contact_name" TEXT,
    "emergency_contact_phone" TEXT,
    "emergency_contact_relationship" TEXT,
    "photo_url" TEXT,
    "remarks" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "created_by" INTEGER,
    CONSTRAINT "residents_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "barangay_clearances" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clearance_no" TEXT NOT NULL,
    "resident_id" INTEGER NOT NULL,
    "purpose" TEXT NOT NULL,
    "ctc_no" TEXT,
    "or_no" TEXT,
    "amount" DECIMAL NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed_at" DATETIME,
    "processed_by" INTEGER,
    CONSTRAINT "barangay_clearances_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "residents" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "barangay_clearances_processed_by_fkey" FOREIGN KEY ("processed_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "incident_reports" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "case_no" TEXT NOT NULL,
    "incident_type" TEXT NOT NULL,
    "incident_date" DATETIME NOT NULL,
    "incident_location" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "complainant_name" TEXT NOT NULL,
    "complainant_address" TEXT,
    "complainant_contact" TEXT,
    "respondent_name" TEXT,
    "respondent_address" TEXT,
    "respondent_contact" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "resolution" TEXT,
    "resolved_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "reported_by" INTEGER,
    CONSTRAINT "incident_reports_reported_by_fkey" FOREIGN KEY ("reported_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "blotters" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "blotter_no" TEXT NOT NULL,
    "resident_id" INTEGER,
    "entry_date" DATETIME NOT NULL,
    "complainant" TEXT NOT NULL,
    "respondent" TEXT,
    "nature_of_complaint" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "action_taken" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    CONSTRAINT "blotters_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "residents" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "blotters_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "financial_transactions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "transaction_no" TEXT NOT NULL,
    "transaction_type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "amount" DECIMAL NOT NULL,
    "description" TEXT,
    "payer_name" TEXT,
    "payee_name" TEXT,
    "reference_no" TEXT,
    "transaction_date" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    CONSTRAINT "financial_transactions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "announcements" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "announcement_type" TEXT NOT NULL DEFAULT 'NEWS',
    "event_date" DATETIME,
    "event_location" TEXT,
    "image_url" TEXT,
    "is_pinned" BOOLEAN NOT NULL DEFAULT false,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "created_by" INTEGER,
    CONSTRAINT "announcements_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "barangay_officials" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "term_start" DATETIME NOT NULL,
    "term_end" DATETIME NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "captain_name" TEXT NOT NULL,
    "captain_photo" TEXT,
    "secretary_name" TEXT,
    "treasurer_name" TEXT,
    "kagawad1_name" TEXT,
    "kagawad2_name" TEXT,
    "kagawad3_name" TEXT,
    "kagawad4_name" TEXT,
    "kagawad5_name" TEXT,
    "kagawad6_name" TEXT,
    "kagawad7_name" TEXT,
    "sk_chairman_name" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "barangay_info" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "district" TEXT,
    "city" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "region" TEXT,
    "contact_number" TEXT,
    "email" TEXT,
    "address" TEXT,
    "latitude" DECIMAL,
    "longitude" DECIMAL,
    "logo_url" TEXT,
    "seal_url" TEXT,
    "mission" TEXT,
    "vision" TEXT,
    "history" TEXT,
    "facebook_url" TEXT,
    "twitter_url" TEXT,
    "updated_at" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "residents_barangay_id_key" ON "residents"("barangay_id");

-- CreateIndex
CREATE UNIQUE INDEX "barangay_clearances_clearance_no_key" ON "barangay_clearances"("clearance_no");

-- CreateIndex
CREATE UNIQUE INDEX "incident_reports_case_no_key" ON "incident_reports"("case_no");

-- CreateIndex
CREATE UNIQUE INDEX "blotters_blotter_no_key" ON "blotters"("blotter_no");

-- CreateIndex
CREATE UNIQUE INDEX "financial_transactions_transaction_no_key" ON "financial_transactions"("transaction_no");
