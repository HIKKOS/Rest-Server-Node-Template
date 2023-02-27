/*
  Warnings:

  - You are about to drop the column `Nombres` on the `alumno` table. All the data in the column will be lost.
  - Added the required column `PrimerNombre` to the `Alumno` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `alumno` DROP COLUMN `Nombres`,
    ADD COLUMN `PrimerNombre` VARCHAR(75) NOT NULL,
    ADD COLUMN `SegundoNombre` VARCHAR(75) NULL;
