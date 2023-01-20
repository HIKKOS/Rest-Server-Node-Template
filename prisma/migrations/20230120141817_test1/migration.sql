/*
  Warnings:

  - You are about to drop the `test` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `test`;

-- CreateTable
CREATE TABLE `Tutor` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Nombres` VARCHAR(75) NOT NULL,
    `ApellidoMaterno` VARCHAR(75) NOT NULL,
    `ApellidoPaterno` VARCHAR(75) NOT NULL,
    `Correo` VARCHAR(255) NOT NULL,
    `Telefono` VARCHAR(20) NOT NULL,
    `RFC` VARCHAR(15) NOT NULL,
    `PasswordTutor` VARCHAR(255) NOT NULL,
    `Direccion` VARCHAR(150) NOT NULL,
    `CreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `MetodoPago` ENUM('PayPal', 'null') NOT NULL DEFAULT 'null',

    UNIQUE INDEX `Tutor_Correo_key`(`Correo`),
    UNIQUE INDEX `Tutor_Telefono_key`(`Telefono`),
    UNIQUE INDEX `Tutor_RFC_key`(`RFC`),
    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Alumno` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Nombres` VARCHAR(75) NOT NULL,
    `ApellidoMaterno` VARCHAR(75) NOT NULL,
    `ApellidoPaterno` VARCHAR(75) NOT NULL,
    `Grado` INTEGER NOT NULL DEFAULT 1,
    `Grupo` VARCHAR(20) NOT NULL DEFAULT 'A',
    `Genero` ENUM('MASCULINO', 'FEMENINO') NOT NULL DEFAULT 'MASCULINO',
    `CreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `TutorId` INTEGER NOT NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Servicio` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Nombres` VARCHAR(75) NOT NULL,
    `Prioritario` BOOLEAN NOT NULL DEFAULT true,
    `Descripcion` VARCHAR(500) NOT NULL,
    `FechaPago` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `Precio` DOUBLE NOT NULL DEFAULT 0.0,
    `AlumnoId` INTEGER NOT NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Administrador` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Nombres` VARCHAR(75) NOT NULL,
    `ApellidoMaterno` VARCHAR(75) NOT NULL,
    `ApellidoPaterno` VARCHAR(75) NOT NULL,
    `Correo` VARCHAR(255) NOT NULL,
    `PasswordAdmin` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `Administrador_Correo_key`(`Correo`),
    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ImgPaths` (
    `Id` INTEGER NOT NULL,
    `UserId` INTEGER NOT NULL,
    `Path` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Alumno` ADD CONSTRAINT `Alumno_TutorId_fkey` FOREIGN KEY (`TutorId`) REFERENCES `Tutor`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Servicio` ADD CONSTRAINT `Servicio_AlumnoId_fkey` FOREIGN KEY (`AlumnoId`) REFERENCES `Alumno`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ImgPaths` ADD CONSTRAINT `ImgPaths_UserId_fkey` FOREIGN KEY (`UserId`) REFERENCES `Servicio`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;
