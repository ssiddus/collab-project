-- CreateTable
CREATE TABLE "InviteToken" (
    "token" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "orgId" TEXT NOT NULL,

    CONSTRAINT "InviteToken_pkey" PRIMARY KEY ("token")
);

-- AddForeignKey
ALTER TABLE "InviteToken" ADD CONSTRAINT "InviteToken_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
