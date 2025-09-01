-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "user_prefs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'ko',
    "reportTimezone" TEXT NOT NULL DEFAULT 'Asia/Phnom_Penh',
    "notificationEmailOptIn" BOOLEAN NOT NULL DEFAULT false,
    "termsAcceptedAt" TEXT,
    "privacyAcceptedAt" TEXT,
    "consentProcessingBirthData" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "user_prefs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_prefs_userId_key" ON "user_prefs"("userId");
