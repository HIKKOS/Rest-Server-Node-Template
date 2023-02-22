/*
  Warnings:

  - You are about to drop the column `Precio` on the `servicio` table. All the data in the column will be lost.
  - You are about to drop the column `Prioritario` on the `servicio` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `serviciosdelalumno` DROP FOREIGN KEY `ServiciosDelAlumno_AlumnoId_fkey`;

-- AlterTable
ALTER TABLE `imgpaths` MODIFY `Id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `servicio` DROP COLUMN `Precio`,
    DROP COLUMN `Prioritario`,
    ADD COLUMN `Cancelable` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `Costo` DOUBLE NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE `ServiciosDelAlumno` ADD CONSTRAINT `Serviciosdelalumno_Alumnoid_Fkey` FOREIGN KEY (`AlumnoId`) REFERENCES `Alumno`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;
