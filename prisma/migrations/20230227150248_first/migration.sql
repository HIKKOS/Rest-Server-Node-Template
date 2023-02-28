/*
  Warnings:

  - You are about to drop the `hoarioservicioalumno` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `hoarioservicioalumno` DROP FOREIGN KEY `HoarioServicioAlumno_AlumnoId_fkey`;

-- DropTable
DROP TABLE `hoarioservicioalumno`;

-- CreateTable
CREATE TABLE `HorarioServicioAlumno` (
    `AlumnoId` VARCHAR(191) NOT NULL,
    `ServicioId` VARCHAR(191) NOT NULL,
    `Dia` ENUM('LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES') NOT NULL,
    `HoraInicio` INTEGER NOT NULL,
    `HoraFin` INTEGER NOT NULL,

    PRIMARY KEY (`AlumnoId`, `ServicioId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `HorarioServicioAlumno` ADD CONSTRAINT `HorarioServicioAlumno_AlumnoId_fkey` FOREIGN KEY (`AlumnoId`) REFERENCES `Alumno`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;
