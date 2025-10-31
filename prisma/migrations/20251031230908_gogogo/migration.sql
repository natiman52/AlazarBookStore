/*
  Warnings:

  - You are about to alter the column `file_size` on the `books` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `books` MODIFY `file_size` INTEGER NULL;
