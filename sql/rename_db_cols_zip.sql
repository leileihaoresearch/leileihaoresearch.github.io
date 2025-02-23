DELETE FROM `zip_df` WHERE `COL 1` = 'zip';

ALTER TABLE `zip_df` RENAME COLUMN `COL 1` TO `zip`;
ALTER TABLE `zip_df` RENAME COLUMN `COL 2` TO `latitude`;
ALTER TABLE `zip_df` RENAME COLUMN `COL 3` TO `longitude`;