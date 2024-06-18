-- DropForeignKey
ALTER TABLE `Image` DROP FOREIGN KEY `Image_postId_fkey`;

-- AlterTable
ALTER TABLE `Post` ADD COLUMN `image` VARCHAR(191) NULL;
