/*
  Warnings:

  - The primary key for the `imgpaths` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `imgpaths` DROP PRIMARY KEY,
    MODIFY `Id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`Id`);
