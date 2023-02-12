/*
  Warnings:

  - The primary key for the `alumno` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `servicio` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `tutor` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `_alumnotoservicio` DROP FOREIGN KEY `_AlumnoToServicio_A_fkey`;

-- DropForeignKey
ALTER TABLE `_alumnotoservicio` DROP FOREIGN KEY `_AlumnoToServicio_B_fkey`;

-- DropForeignKey
ALTER TABLE `alumno` DROP FOREIGN KEY `Alumno_TutorId_fkey`;

-- DropForeignKey
ALTER TABLE `imgpaths` DROP FOREIGN KEY `ImgPaths_ServicioId_fkey`;

-- AlterTable
ALTER TABLE `_alumnotoservicio` MODIFY `A` VARCHAR(191) NOT NULL,
    MODIFY `B` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `alumno` DROP PRIMARY KEY,
    MODIFY `Id` VARCHAR(191) NOT NULL,
    MODIFY `TutorId` VARCHAR(191) NULL,
    ADD PRIMARY KEY (`Id`);

-- AlterTable
ALTER TABLE `imgpaths` MODIFY `ServicioId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `servicio` DROP PRIMARY KEY,
    MODIFY `Id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`Id`);

-- AlterTable
ALTER TABLE `tutor` DROP PRIMARY KEY,
    ADD COLUMN `Foto` VARCHAR(75) NULL,
    MODIFY `Id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`Id`);

-- CreateTable
CREATE TABLE `Pago` (
    `ServicioId` VARCHAR(191) NOT NULL,
    `TutorId` VARCHAR(191) NOT NULL,
    `AlumnoId` INTEGER NOT NULL,
    `FechaPago` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `Precio` DOUBLE NOT NULL,

    PRIMARY KEY (`ServicioId`, `TutorId`, `AlumnoId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Alumno` ADD CONSTRAINT `Alumno_TutorId_fkey` FOREIGN KEY (`TutorId`) REFERENCES `Tutor`(`Id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pago` ADD CONSTRAINT `Pago_ServicioId_fkey` FOREIGN KEY (`ServicioId`) REFERENCES `Servicio`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pago` ADD CONSTRAINT `Pago_TutorId_fkey` FOREIGN KEY (`TutorId`) REFERENCES `Tutor`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ImgPaths` ADD CONSTRAINT `ImgPaths_ServicioId_fkey` FOREIGN KEY (`ServicioId`) REFERENCES `Servicio`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AlumnoToServicio` ADD CONSTRAINT `_AlumnoToServicio_A_fkey` FOREIGN KEY (`A`) REFERENCES `Alumno`(`Id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AlumnoToServicio` ADD CONSTRAINT `_AlumnoToServicio_B_fkey` FOREIGN KEY (`B`) REFERENCES `Servicio`(`Id`) ON DELETE CASCADE ON UPDATE CASCADE;
