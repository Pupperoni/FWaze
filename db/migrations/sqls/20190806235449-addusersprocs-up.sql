DROP PROCEDURE IF EXISTS GetUserById;

CREATE PROCEDURE GetUserById(IN userId VARCHAR(15))
BEGIN
    SELECT *
    FROM users
    WHERE id = userId;
END;

DROP PROCEDURE IF EXISTS CreateUser;

CREATE PROCEDURE CreateUser(
    IN userId VARCHAR(15),
    IN userName VARCHAR(255),
    IN userEmail VARCHAR (255),
    IN userPassword VARCHAR (255),
    IN userRole INT(11)
)
BEGIN
    INSERT INTO users (id, name, email, password, role)
    VALUES (userId, userName, userEmail, userPassword, userRole);
END;

DROP PROCEDURE IF EXISTS UpdateUser;

CREATE PROCEDURE UpdateUser(
    IN userName VARCHAR(255), 
    IN userEmail VARCHAR(255),
    IN userRole INT(11),
    IN userID VARCHAR(15)
)
BEGIN
    UPDATE users SET name = userName, email = userEmail, role = userRole
    WHERE id = userId;
END;