-- AlterTable
ALTER TABLE "user_prefs" ADD COLUMN "constraints" TEXT;
ALTER TABLE "user_prefs" ADD COLUMN "currentResidenceCity" TEXT;
ALTER TABLE "user_prefs" ADD COLUMN "decisionTimeline" TEXT;
ALTER TABLE "user_prefs" ADD COLUMN "goals" TEXT;
ALTER TABLE "user_prefs" ADD COLUMN "interests" TEXT;
ALTER TABLE "user_prefs" ADD COLUMN "interpretationExperience" TEXT;
ALTER TABLE "user_prefs" ADD COLUMN "interpretationTone" TEXT;
ALTER TABLE "user_prefs" ADD COLUMN "occupation" TEXT;
ALTER TABLE "user_prefs" ADD COLUMN "role" TEXT;

-- CreateTable
CREATE TABLE "birth_data" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "birthDate" TEXT NOT NULL,
    "birthTime" TEXT NOT NULL,
    "birthPlace" TEXT NOT NULL,
    "birthCountry" TEXT NOT NULL,
    "birthTimezone" TEXT NOT NULL,
    "sexAtBirth" TEXT NOT NULL,
    "timeAccuracy" TEXT NOT NULL,
    "timeSource" TEXT,
    "rectificationAnchors" TEXT,
    "notes" TEXT,
    CONSTRAINT "birth_data_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "birth_data_userId_key" ON "birth_data"("userId");
