DROP TABLE IF EXISTS `comments`;
CREATE TABLE `comments` (
  `id` varchar(15) NOT NULL,
  `user_id` varchar(15) NOT NULL,
  `userName` varchar(255) DEFAULT NULL,
  `report_id` varchar(15) DEFAULT NULL,
  `body` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `comments_user_name_foreign` (`userName`),
  KEY `comments_report_id_foreign` (`report_id`),
  CONSTRAINT `comments_report_id_foreign` FOREIGN KEY (`report_id`) REFERENCES `reports` (`id`),
  CONSTRAINT `comments_user_name_foreign` FOREIGN KEY (`userName`) REFERENCES `users` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;
