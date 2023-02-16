/*
  Warnings:

  - You are about to drop the column `Precio` on the `pago` table. All the data in the column will be lost.
  - Added the required column `Monto` to the `Pago` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `pago` DROP COLUMN `Precio`,
    ADD COLUMN `Monto` DOUBLE NOT NULL;
