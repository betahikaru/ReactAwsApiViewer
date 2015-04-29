/**
 * aws iam list-groups
 */
'use strict';

var ServerConfig =
{
  //"aws_iam_users_url" : "https://aws-rest-server.herokuapp.com/aws/iam/users?test=1",
  "aws_iam_users_url" : "http://localhost:9292/aws/iam/users",
  //"aws_iam_groups_url" : "https://aws-rest-server.herokuapp.com/aws/iam/groups?test=1",
  "aws_iam_groups_url" : "http://localhost:9292/aws/iam/groups",
  "aws_iam_user_groups_url" : "http://localhost:9292/aws/iam/users/${user_name}/groups",
};

module.exports = ServerConfig;
