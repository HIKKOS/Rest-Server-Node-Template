-- DropForeignKey
ALTER TABLE `alumno` DROP FOREIGN KEY `Alumno_TutorId_fkey`;

-- AlterTable
ALTER TABLE `alumno` MODIFY `TutorId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Alumno` ADD CONSTRAINT `Alumno_TutorId_fkey` FOREIGN KEY (`TutorId`) REFERENCES `Tutor`(`Id`) ON DELETE SET NULL ON UPDATE CASCADE;
