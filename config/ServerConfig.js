/**
 * aws iam list-groups
 */
'use strict';

var Server = "https://aws-rest-server.herokuapp.com";
//var Server = "http://localhost:9292";

var TestEnable = false;
// var TestEnable = true;

var TestQuery = TestEnable ? "?test=1" : "";
var ServerConfig =
{
  "aws_iam_users_url" : Server + "/aws/iam/users" + TestQuery,
  "aws_iam_groups_url" : Server + "/aws/iam/groups" + TestQuery,
  "aws_iam_user_groups_url" : Server + "/aws/iam/users/${user_name}/groups" + TestQuery,
};

module.exports = ServerConfig;
