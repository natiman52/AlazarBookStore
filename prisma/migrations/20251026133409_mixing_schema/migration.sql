/*
  Warnings:

  - You are about to drop the column `category` on the `Books` table. All the data in the column will be lost.
  - You are about to drop the column `cover_url` on the `Books` table. All the data in the column will be lost.
  - You are about to drop the column `file_size` on the `Books` table. All the data in the column will be lost.
  - You are about to drop the column `file_type` on the `Books` table. All the data in the column will be lost.
  - You are about to drop the column `file_url` on the `Books` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Books` table. All the data in the column will be lost.
  - Added the required column `download_link` to the `Books` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image_file_id` to the `Books` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Books` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating` to the `Books` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Books` DROP COLUMN `category`,
    DROP COLUMN `cover_url`,
    DROP COLUMN `file_size`,
    DROP COLUMN `file_type`,
    DROP COLUMN `file_url`,
    DROP COLUMN `title`,
    ADD COLUMN `download_link` VARCHAR(255) NOT NULL,
    ADD COLUMN `image_file_id` VARCHAR(255) NOT NULL,
    ADD COLUMN `name` VARCHAR(255) NOT NULL,
    ADD COLUMN `rating` DOUBLE NOT NULL;
