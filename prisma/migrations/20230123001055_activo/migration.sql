-- AlterTable
ALTER TABLE `administrador` ADD COLUMN `Activo` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `alumno` ADD COLUMN `Activo` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `servicio` ADD COLUMN `Activo` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `tutor` ADD COLUMN `Activo` BOOLEAN NOT NULL DEFAULT true;
