DROP TABLE IF EXISTS `advertisements`;
CREATE TABLE `advertisements` (
  `id` varchar(15) NOT NULL,
  `caption` varchar(255) NOT NULL,
  `user_id` varchar(15) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `position` point DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `advertisements_user_id_foreign` (`user_id`),
  CONSTRAINT `advertisements_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
