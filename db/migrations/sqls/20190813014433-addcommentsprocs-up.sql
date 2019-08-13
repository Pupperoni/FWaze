DROP PROCEDURE IF EXISTS CreateComment;

CREATE PROCEDURE CreateComment(
    IN commentId VARCHAR(15),
    IN userName VARCHAR(255),
    IN reportId VARCHAR(15),
    IN comment VARCHAR(255)
)
BEGIN
    INSERT INTO comments (id, userName, report_id, body)
    VALUES (commentId, userName, reportId, comment);
END;

DROP PROCEDURE IF EXISTS GetComments;

CREATE PROCEDURE GetComments()
BEGIN
    SELECT *
    FROM comments;
END;

DROP PROCEDURE IF EXISTS GetCommentsByReportId;

CREATE PROCEDURE GetCommentsByReportId(
    IN reportId VARCHAR(15)
)
BEGIN
    SELECT *
    FROM comments
    WHERE report_id = reportId;
END;

DROP PROCEDURE IF EXISTS GetCommentsByUserId;

CREATE PROCEDURE GetCommentsByUserId(
    IN userName VARCHAR(255)
)
BEGIN
    SELECT *
    FROM comments
    WHERE userName = userName;
END;

DROP PROCEDURE IF EXISTS GetCommentsById;

CREATE PROCEDURE GetCommentsById(
    IN commentId VARCHAR(15)
)
BEGIN
    SELECT *
    FROM comments
    WHERE id = commentId;
END;
