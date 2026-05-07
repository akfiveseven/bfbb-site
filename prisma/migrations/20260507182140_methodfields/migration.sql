/*
  Warnings:

  - You are about to drop the column `hans` on the `Strategy` table. All the data in the column will be lost.
  - You are about to drop the column `links` on the `Strategy` table. All the data in the column will be lost.
  - You are about to drop the column `prerequisites` on the `Strategy` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Method" ADD COLUMN     "hans" TEXT NOT NULL DEFAULT 'N/A',
ADD COLUMN     "links" TEXT NOT NULL DEFAULT '[]',
ADD COLUMN     "prerequisites" TEXT NOT NULL DEFAULT '[]';

-- AlterTable
ALTER TABLE "Strategy" DROP COLUMN "hans",
DROP COLUMN "links",
DROP COLUMN "prerequisites";
