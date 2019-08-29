DROP TABLE IF EXISTS `fave_routes`;

CREATE TABLE `fave_routes`(
    `id` varchar(15) NOT NULL,
    `name` varchar(255),
    `source_coords` geometry NOT NULL,
    `destination_coords` geometry NOT NULL,
    `source_string` varchar(255) NOT NULL,
    `destination_string` varchar(255) NOT NULL,
    `user_id` varchar(15) NOT NULL,
    PRIMARY KEY (`id`),
    KEY `fave_routes_user_id_foreign` (`user_id`),
    CONSTRAINT `fave_routes_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;