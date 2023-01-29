/*
  Warnings:

  - You are about to alter the column `Grupo` on the `alumno` table. The data in that column could be lost. The data in that column will be cast from `VarChar(20)` to `Enum(EnumId(2))`.

*/
-- AlterTable
ALTER TABLE `alumno` MODIFY `Grupo` ENUM('A', 'B', 'C') NOT NULL;

-- CreateTable
CREATE TABLE `Pagos` (
    `TutorId` INTEGER NOT NULL,
    `ServicioId` INTEGER NOT NULL,
    `AlumnoId` INTEGER NOT NULL,
    `Facturado` BOOLEAN NOT NULL DEFAULT false,
    `Monto` DOUBLE NOT NULL,
    `FechaDelPago` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `MetodoPago` ENUM('PayPal', 'null') NOT NULL DEFAULT 'PayPal',

    PRIMARY KEY (`TutorId`, `ServicioId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Pagos` ADD CONSTRAINT `Pagos_TutorId_fkey` FOREIGN KEY (`TutorId`) REFERENCES `Tutor`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pagos` ADD CONSTRAINT `Pagos_ServicioId_fkey` FOREIGN KEY (`ServicioId`) REFERENCES `Servicio`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;
