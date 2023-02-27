/*
  Warnings:

  - You are about to drop the column `FechaExpiracion` on the `serviciosdelalumno` table. All the data in the column will be lost.
  - Added the required column `DiasRestantes` to the `ServiciosDelAlumno` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `serviciosdelalumno` DROP COLUMN `FechaExpiracion`,
    ADD COLUMN `DiasRestantes` INTEGER NOT NULL;
