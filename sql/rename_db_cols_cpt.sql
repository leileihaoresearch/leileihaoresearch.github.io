DELETE FROM `cpt_df` WHERE `COL 1` = 'hcpcs_code';

ALTER TABLE `cpt_df` RENAME COLUMN `COL 1` TO `hcpcs_code`;
ALTER TABLE `cpt_df` RENAME COLUMN `COL 2` TO `hcpcs_desc`;
ALTER TABLE `cpt_df` RENAME COLUMN `COL 3` TO `tot_services`;
ALTER TABLE `cpt_df` RENAME COLUMN `COL 4` TO `num_npi`;
ALTER TABLE `cpt_df` RENAME COLUMN `COL 5` TO `num_per_npi`;