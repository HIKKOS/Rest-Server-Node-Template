-- CreateTable
CREATE TABLE `Tutor` (
    `Id` VARCHAR(191) NOT NULL,
    `Nombres` VARCHAR(75) NOT NULL,
    `ApellidoMaterno` VARCHAR(75) NOT NULL,
    `ApellidoPaterno` VARCHAR(75) NULL,
    `Foto` VARCHAR(75) NULL,
    `Correo` VARCHAR(255) NOT NULL,
    `Telefono` VARCHAR(20) NOT NULL,
    `RFC` VARCHAR(15) NULL,
    `PasswordTutor` VARCHAR(255) NOT NULL,
    `Direccion` VARCHAR(150) NULL,
    `CreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `Activo` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `Tutor_Correo_key`(`Correo`),
    UNIQUE INDEX `Tutor_Telefono_key`(`Telefono`),
    UNIQUE INDEX `Tutor_RFC_key`(`RFC`),
    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MetodoPago` (
    `Id` VARCHAR(191) NOT NULL,
    `Nombre` VARCHAR(191) NOT NULL,
    `TutorId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Alumno` (
    `Id` VARCHAR(191) NOT NULL,
    `Nombres` VARCHAR(75) NOT NULL,
    `ApellidoMaterno` VARCHAR(75) NOT NULL,
    `ApellidoPaterno` VARCHAR(75) NULL,
    `Grado` INTEGER NOT NULL DEFAULT 1,
    `Grupo` VARCHAR(20) NOT NULL DEFAULT 'A',
    `Genero` INTEGER NOT NULL,
    `CreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `TutorId` VARCHAR(191) NULL,
    `Activo` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ServiciosDelAlumno` (
    `Id` VARCHAR(191) NOT NULL,
    `AlumnoId` VARCHAR(191) NOT NULL,
    `ServicioId` VARCHAR(191) NOT NULL,
    `Monto` DOUBLE NOT NULL,
    `VecesPagado` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Servicio` (
    `Id` VARCHAR(191) NOT NULL,
    `Nombre` VARCHAR(75) NOT NULL,
    `Prioritario` BOOLEAN NOT NULL DEFAULT true,
    `Descripcion` VARCHAR(500) NOT NULL,
    `FechaPago` INTEGER NOT NULL,
    `Precio` DOUBLE NOT NULL DEFAULT 0.0,
    `Activo` BOOLEAN NOT NULL DEFAULT true,
    `FrecuenciaDePago` ENUM('SEMANAL', 'MENSUAL', 'BIMESTRAL', 'SEMESTRAL', 'ANUAL') NOT NULL DEFAULT 'MENSUAL',

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pago` (
    `Folio` INTEGER NOT NULL,
    `ServicioId` VARCHAR(191) NOT NULL,
    `TutorId` VARCHAR(191) NOT NULL,
    `AlumnoId` INTEGER NOT NULL,
    `FechaPago` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `Precio` DOUBLE NOT NULL,
    `Facturar` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`Folio`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Administrador` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Nombres` VARCHAR(75) NOT NULL,
    `ApellidoMaterno` VARCHAR(75) NOT NULL,
    `ApellidoPaterno` VARCHAR(75) NULL,
    `Correo` VARCHAR(255) NOT NULL,
    `PasswordAdmin` VARCHAR(255) NOT NULL,
    `Activo` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `Administrador_Correo_key`(`Correo`),
    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ImgPaths` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `ServicioId` VARCHAR(191) NOT NULL,
    `Path` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MetodoPago` ADD CONSTRAINT `MetodoPago_TutorId_fkey` FOREIGN KEY (`TutorId`) REFERENCES `Tutor`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Alumno` ADD CONSTRAINT `Alumno_TutorId_fkey` FOREIGN KEY (`TutorId`) REFERENCES `Tutor`(`Id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiciosDelAlumno` ADD CONSTRAINT `ServiciosDelAlumno_AlumnoId_fkey` FOREIGN KEY (`AlumnoId`) REFERENCES `Alumno`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiciosDelAlumno` ADD CONSTRAINT `ServiciosDelAlumno_ServicioId_fkey` FOREIGN KEY (`ServicioId`) REFERENCES `Servicio`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pago` ADD CONSTRAINT `Pago_ServicioId_fkey` FOREIGN KEY (`ServicioId`) REFERENCES `Servicio`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pago` ADD CONSTRAINT `Pago_TutorId_fkey` FOREIGN KEY (`TutorId`) REFERENCES `Tutor`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ImgPaths` ADD CONSTRAINT `ImgPaths_ServicioId_fkey` FOREIGN KEY (`ServicioId`) REFERENCES `Servicio`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;
