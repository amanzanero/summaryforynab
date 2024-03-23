-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "ynabId" TEXT NOT NULL,
    "preferredUtcTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_ynabId_key" ON "User"("ynabId");

-- CreateIndex
CREATE INDEX "User_preferredUtcTime_idx" ON "User"("preferredUtcTime");
