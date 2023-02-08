/*
  Warnings:

  - You are about to alter the column `Genero` on the `alumno` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Int`.

*/
-- AlterTable
ALTER TABLE `alumno` MODIFY `Genero` INTEGER NOT NULL;
