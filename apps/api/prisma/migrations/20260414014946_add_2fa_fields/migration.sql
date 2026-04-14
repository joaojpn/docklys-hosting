-- AlterTable
ALTER TABLE "User" ADD COLUMN     "failedOtpAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "otpLockedUntil" TIMESTAMP(3),
ADD COLUMN     "recoveryCodes" TEXT[],
ADD COLUMN     "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "twoFactorSecret" TEXT,
ADD COLUMN     "twoFactorTempSecret" TEXT;
