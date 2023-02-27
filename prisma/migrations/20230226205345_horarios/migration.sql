/*
  Warnings:

  - The primary key for the `serviciosdelalumno` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Id` on the `serviciosdelalumno` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `serviciosdelalumno` DROP FOREIGN KEY `Serviciosdelalumno_Alumnoid_Fkey`;

-- AlterTable
ALTER TABLE `serviciosdelalumno` DROP PRIMARY KEY,
    DROP COLUMN `Id`,
    ADD PRIMARY KEY (`AlumnoId`, `ServicioId`);

-- AddForeignKey
ALTER TABLE `ServiciosDelAlumno` ADD CONSTRAINT `ServiciosDelAlumno_AlumnoId_fkey` FOREIGN KEY (`AlumnoId`) REFERENCES `Alumno`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HoarioServicioAlumno` ADD CONSTRAINT `HoarioServicioAlumno_AlumnoId_fkey` FOREIGN KEY (`AlumnoId`) REFERENCES `Alumno`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;
