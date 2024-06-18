-- DropIndex
DROP INDEX `Image_postId_fkey` ON `Image`;

-- AlterTable
ALTER TABLE `Post` MODIFY `image` LONGTEXT NULL;
