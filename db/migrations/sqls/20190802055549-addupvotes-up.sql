DROP TABLE IF EXISTS `upvotes`;
CREATE TABLE `upvotes` (
    `report_id` varchar(15) NOT NULL,
    `user_id` varchar(15) NOT NULL,
    FOREIGN KEY (`report_id`) REFERENCES `reports` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    PRIMARY KEY (`report_id`, `user_id`)
) 