-- CreateTable ContactLead
CREATE TABLE "ContactLead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'web-form',
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE INDEX "ContactLead_email_idx" ON "ContactLead"("email");

-- CreateIndex
CREATE INDEX "ContactLead_status_idx" ON "ContactLead"("status");

-- CreateIndex
CREATE INDEX "ContactLead_createdAt_idx" ON "ContactLead"("createdAt");
