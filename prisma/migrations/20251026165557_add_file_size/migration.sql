/*
  Warnings:

  - You are about to drop the column `image_file_id` on the `books` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `books` DROP COLUMN `image_file_id`,
    ADD COLUMN `image_path` VARCHAR(255) NULL,
    MODIFY `file_size` VARCHAR(191) NULL;
