DROP TABLE IF EXISTS `upvotes`;
CREATE TABLE `upvotes` (
    `report_id` int(11) unsigned NOT NULL,
    `user_id` int(10) unsigned NOT NULL,
    FOREIGN KEY (`report_id`) REFERENCES `reports` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    PRIMARY KEY (`report_id`, `user_id`)
) 