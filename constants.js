module.exports = {
  // User aggregates constants
  USER_AGGREGATE_NAME: "users",
  USER_CREATED: "user_created",
  USER_UPDATED: "user_updated",
  USER_HOME_UPDATED: "user_home_updated",
  USER_WORK_UPDATED: "user_work_updated",
  USER_ROUTE_CREATED: "user_route_created",

  // Report aggregate constants
  REPORT_AGGREGATE_NAME: "reports",
  REPORT_CREATED: "report_created",
  REPORT_VOTE_CREATED: "report_vote_created",
  REPORT_VOTE_DELETED: "report_vote_deleted",

  // Advertistement aggregate constants
  AD_AGGREGATE_NAME: "ads",
  AD_CREATED: "ad_create",

  // Comment aggregate constants
  COMMENT_AGGREGATE_NAME: "comments",
  COMMENT_CREATED: "comment_created",

  // Success messages
  DEFAULT_SUCCESS: "Success",
  LOGIN_SUCCESS: "Login success",

  // Errors messages
  DEFAULT_INVALID_DATA: "Invalid data received",
  DEFAULT_SERVER_ERROR: "Something is wrong with the server. Try again later",
  USER_NOT_EXISTS: "This user does not exist",
  DEFAULT_LOGIN_FAILURE: "Login failed",
  PASSWORDS_NOT_MATCH: "Passwords do not match",
  USERNAME_TAKEN: "Username already taken",
  EMAIL_TAKEN: "Email address already registered",
  EMAIL_INVALID_FORMAT: "Format is not a valid email address",
  USER_NOT_PERMITTED: "You don't have the right permissions",
  REPORT_NOT_EXISTS: "This report does not exist",
  INVALID_REPORT_TYPE: "Invalid report type",
  REPORT_TYPE_EMPTY: "No reports of this type",
  AD_NOT_EXISTS: "This ad does not exist",
  COMMENT_NOT_EXISTS: "This comment does not exist",
  COMMENTS_NOT_FOUND: "No comments found",
  FILE_NOT_FOUND: "File not found"
};
