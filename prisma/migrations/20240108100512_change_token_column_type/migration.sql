-- AlterTable
ALTER TABLE `User` MODIFY `jikeRefreshToken` VARCHAR(1000) NOT NULL,
    MODIFY `jikeAccessToken` VARCHAR(1000) NOT NULL;
