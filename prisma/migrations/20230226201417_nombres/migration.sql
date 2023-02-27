/*
  Warnings:

  - You are about to drop the column `Nombres` on the `administrador` table. All the data in the column will be lost.
  - You are about to drop the column `Monto` on the `serviciosdelalumno` table. All the data in the column will be lost.
  - You are about to drop the column `VecesPagado` on the `serviciosdelalumno` table. All the data in the column will be lost.
  - You are about to drop the column `Nombres` on the `tutor` table. All the data in the column will be lost.
  - Added the required column `PrimerNombre` to the `Administrador` table without a default value. This is not possible if the table is not empty.
  - Added the required column `FechaExpiracion` to the `ServiciosDelAlumno` table without a default value. This is not possible if the table is not empty.
  - Added the required column `PrimerNombre` to the `Tutor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `administrador` DROP COLUMN `Nombres`,
    ADD COLUMN `PrimerNombre` VARCHAR(75) NOT NULL,
    ADD COLUMN `SegundoNombre` VARCHAR(75) NULL;

-- AlterTable
ALTER TABLE `serviciosdelalumno` DROP COLUMN `Monto`,
    DROP COLUMN `VecesPagado`,
    ADD COLUMN `FechaExpiracion` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `tutor` DROP COLUMN `Nombres`,
    ADD COLUMN `PrimerNombre` VARCHAR(75) NOT NULL,
    ADD COLUMN `SegundoNombre` VARCHAR(75) NULL;

-- CreateTable
CREATE TABLE `HorarioServicio` (
    `Id` VARCHAR(191) NOT NULL,
    `ServicioId` VARCHAR(191) NOT NULL,
    `Dia` ENUM('LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES') NOT NULL,
    `HoraInicio` INTEGER NOT NULL,
    `HoraFin` INTEGER NOT NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HoarioServicioAlumno` (
    `AlumnoId` VARCHAR(191) NOT NULL,
    `ServicioId` VARCHAR(191) NOT NULL,
    `Dia` ENUM('LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES') NOT NULL,
    `HoraInicio` INTEGER NOT NULL,
    `HoraFin` INTEGER NOT NULL,

    PRIMARY KEY (`AlumnoId`, `ServicioId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `HorarioServicio` ADD CONSTRAINT `HorarioServicio_ServicioId_fkey` FOREIGN KEY (`ServicioId`) REFERENCES `Servicio`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;
