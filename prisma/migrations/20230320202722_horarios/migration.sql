/*
  Warnings:

  - You are about to drop the column `HoraFin` on the `horarioservicio` table. All the data in the column will be lost.
  - You are about to drop the column `HoraInicio` on the `horarioservicio` table. All the data in the column will be lost.
  - You are about to drop the column `HoraFin` on the `horarioservicioalumno` table. All the data in the column will be lost.
  - You are about to drop the column `HoraInicio` on the `horarioservicioalumno` table. All the data in the column will be lost.
  - You are about to drop the column `DiasRestantes` on the `serviciosdelalumno` table. All the data in the column will be lost.
  - Added the required column `Fin` to the `HorarioServicio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Inicio` to the `HorarioServicio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Fin` to the `HorarioServicioAlumno` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Inicio` to the `HorarioServicioAlumno` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `horarioservicio` DROP COLUMN `HoraFin`,
    DROP COLUMN `HoraInicio`,
    ADD COLUMN `Fin` INTEGER NOT NULL,
    ADD COLUMN `Inicio` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `horarioservicioalumno` DROP COLUMN `HoraFin`,
    DROP COLUMN `HoraInicio`,
    ADD COLUMN `Fin` INTEGER NOT NULL,
    ADD COLUMN `Inicio` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `serviciosdelalumno` DROP COLUMN `DiasRestantes`,
    ADD COLUMN `FechaContrato` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `FechaExpiracion` DATETIME(3) NULL;
