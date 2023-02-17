-- CreateTable
CREATE TABLE `administrador` (
    `Id` VARCHAR(191) NOT NULL,
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
CREATE TABLE `alumno` (
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

    INDEX `Alumno_TutorId_fkey`(`TutorId`),
    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `imgpaths` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `ServicioId` VARCHAR(191) NOT NULL,
    `Path` VARCHAR(191) NOT NULL,

    INDEX `ImgPaths_ServicioId_fkey`(`ServicioId`),
    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `metodopago` (
    `Id` VARCHAR(191) NOT NULL,
    `Nombre` VARCHAR(191) NOT NULL,
    `TutorId` VARCHAR(191) NOT NULL,

    INDEX `MetodoPago_TutorId_fkey`(`TutorId`),
    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pago` (
    `Folio` INTEGER NOT NULL AUTO_INCREMENT,
    `ServicioId` VARCHAR(191) NOT NULL,
    `TutorId` VARCHAR(191) NOT NULL,
    `AlumnoId` VARCHAR(191) NOT NULL,
    `FechaPago` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `Facturar` BOOLEAN NOT NULL DEFAULT false,
    `Monto` DOUBLE NOT NULL,

    INDEX `Pago_ServicioId_fkey`(`ServicioId`),
    INDEX `Pago_TutorId_fkey`(`TutorId`),
    PRIMARY KEY (`Folio`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `servicio` (
    `Id` VARCHAR(191) NOT NULL,
    `Nombre` VARCHAR(75) NOT NULL,
    `Prioritario` BOOLEAN NOT NULL DEFAULT true,
    `Descripcion` VARCHAR(500) NOT NULL,
    `FechaPago` INTEGER NOT NULL,
    `Precio` DOUBLE NOT NULL DEFAULT 0,
    `Activo` BOOLEAN NOT NULL DEFAULT true,
    `FrecuenciaDePago` ENUM('SEMANAL', 'MENSUAL', 'BIMESTRAL', 'SEMESTRAL', 'ANUAL') NOT NULL DEFAULT 'MENSUAL',

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `serviciosdelalumno` (
    `Id` VARCHAR(191) NOT NULL,
    `AlumnoId` VARCHAR(191) NOT NULL,
    `ServicioId` VARCHAR(191) NOT NULL,
    `Monto` DOUBLE NOT NULL,
    `VecesPagado` INTEGER NOT NULL DEFAULT 1,

    INDEX `ServiciosDelAlumno_AlumnoId_fkey`(`AlumnoId`),
    INDEX `ServiciosDelAlumno_ServicioId_fkey`(`ServicioId`),
    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tutor` (
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

-- AddForeignKey
ALTER TABLE `alumno` ADD CONSTRAINT `Alumno_TutorId_fkey` FOREIGN KEY (`TutorId`) REFERENCES `tutor`(`Id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `imgpaths` ADD CONSTRAINT `ImgPaths_ServicioId_fkey` FOREIGN KEY (`ServicioId`) REFERENCES `servicio`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `metodopago` ADD CONSTRAINT `MetodoPago_TutorId_fkey` FOREIGN KEY (`TutorId`) REFERENCES `tutor`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pago` ADD CONSTRAINT `Pago_ServicioId_fkey` FOREIGN KEY (`ServicioId`) REFERENCES `servicio`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pago` ADD CONSTRAINT `Pago_TutorId_fkey` FOREIGN KEY (`TutorId`) REFERENCES `tutor`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `serviciosdelalumno` ADD CONSTRAINT `ServiciosDelAlumno_AlumnoId_fkey` FOREIGN KEY (`AlumnoId`) REFERENCES `alumno`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `serviciosdelalumno` ADD CONSTRAINT `ServiciosDelAlumno_ServicioId_fkey` FOREIGN KEY (`ServicioId`) REFERENCES `servicio`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;
