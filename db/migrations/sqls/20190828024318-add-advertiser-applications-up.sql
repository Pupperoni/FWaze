-- Create table
DROP TABLE IF EXISTS advertiser_applications;

CREATE TABLE advertiser_applications(
    `id` VARCHAR(15),
    `user_id` VARCHAR(15) NOT NULL,
    `user_name` VARCHAR(255) NOT NULL,
    `status` INT NOT NULL DEFAULT 0,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(`id`)
);

-- Add stored procedures
DROP PROCEDURE IF EXISTS GetPendingApplications;

CREATE PROCEDURE GetPendingApplications()
BEGIN
    SELECT id, user_id, user_name, status, created_at
    FROM advertiser_applications
    WHERE status = 0
    ORDER BY created_at;
END;

DROP PROCEDURE IF EXISTS GetAllApplications;

CREATE PROCEDURE GetAllApplications()
BEGIN
    SELECT id, user_id, user_name, status, created_at
    FROM advertiser_applications
    ORDER BY created_at;
END;

DROP PROCEDURE IF EXISTS CreateApplication;

CREATE PROCEDURE CreateApplication(
    IN advertisementId VARCHAR(15),
    IN userId VARCHAR(15),
    IN userName VARCHAR(255),
    IN timenow TIMESTAMP
)
BEGIN
    INSERT INTO advertiser_applications (id, user_id, user_name, created_at)
    VALUES (advertisementId, userId, userName, timenow);
END;

DROP PROCEDURE IF EXISTS ApproveApplication;

CREATE PROCEDURE ApproveApplication(
    IN userId VARCHAR(15)
)
BEGIN
    UPDATE advertiser_applications
    SET status = 1
    WHERE user_id = userId;
END;

DROP PROCEDURE IF EXISTS RejectApplication;

CREATE PROCEDURE RejectApplication(
    IN userId VARCHAR(15)
)
BEGIN
    UPDATE advertiser_applications
    SET status = -1
    WHERE user_id = userId;
END;

-- Create index
CREATE INDEX idx_applications_status_timestamp ON advertiser_applications (status, created_at);
CREATE INDEX idx_applications_timestamp ON advertiser_applications (created_at);

