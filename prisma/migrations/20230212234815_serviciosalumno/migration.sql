/*
  Warnings:

  - You are about to drop the `_alumnotoservicio` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `FechaPago` on the `servicio` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE `_alumnotoservicio` DROP FOREIGN KEY `_AlumnoToServicio_A_fkey`;

-- DropForeignKey
ALTER TABLE `_alumnotoservicio` DROP FOREIGN KEY `_AlumnoToServicio_B_fkey`;

-- AlterTable
ALTER TABLE `servicio` DROP COLUMN `FechaPago`,
    ADD COLUMN `FechaPago` INTEGER NOT NULL;

-- DropTable
DROP TABLE `_alumnotoservicio`;

-- CreateTable
CREATE TABLE `ServiciosDelAlumno` (
    `AlumnoId` VARCHAR(191) NOT NULL,
    `ServicioId` VARCHAR(191) NOT NULL,
    `Pagado` BOOLEAN NOT NULL DEFAULT false,
    `Monto` DOUBLE NOT NULL,

    PRIMARY KEY (`AlumnoId`, `ServicioId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ServiciosDelAlumno` ADD CONSTRAINT `ServiciosDelAlumno_AlumnoId_fkey` FOREIGN KEY (`AlumnoId`) REFERENCES `Alumno`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiciosDelAlumno` ADD CONSTRAINT `ServiciosDelAlumno_ServicioId_fkey` FOREIGN KEY (`ServicioId`) REFERENCES `Servicio`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;
