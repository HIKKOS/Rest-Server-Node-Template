/*
  Warnings:

  - You are about to drop the column `UserId` on the `imgpaths` table. All the data in the column will be lost.
  - Added the required column `ServicioId` to the `ImgPaths` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `imgpaths` DROP FOREIGN KEY `ImgPaths_UserId_fkey`;

-- AlterTable
ALTER TABLE `imgpaths` DROP COLUMN `UserId`,
    ADD COLUMN `ServicioId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `ImgPaths` ADD CONSTRAINT `ImgPaths_ServicioId_fkey` FOREIGN KEY (`ServicioId`) REFERENCES `Servicio`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;
