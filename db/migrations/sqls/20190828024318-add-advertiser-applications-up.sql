-- Create table
DROP TABLE IF EXISTS advertiser_applications;

CREATE TABLE advertiser_applications(
    `user_id` VARCHAR(15) NOT NULL,
    `user_name` VARCHAR(255) NOT NULL UNIQUE,
    `status` INT NOT NULL DEFAULT 0,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(`user_id`)
);

-- Add stored procedures
DROP PROCEDURE IF EXISTS GetPendingApplications;

CREATE PROCEDURE GetPendingApplications()
BEGIN
    SELECT user_id, user_name, status, created_at
    FROM advertiser_applications
    WHERE status = 0
    ORDER BY created_at;
END;

DROP PROCEDURE IF EXISTS CreateApplication;

CREATE PROCEDURE CreateApplication(
    IN userId VARCHAR(15),
    IN userName VARCHAR(255),
    IN timenow TIMESTAMP
)
BEGIN
    INSERT INTO advertiser_applications (user_id, user_name, created_at)
    VALUES (userId, userName, timenow);
END;


-- Create index
CREATE INDEX idx_applications_status_timestamp ON advertiser_applications (status, created_at);
CREATE INDEX idx_applications_timestamp ON advertiser_applications (created_at);

