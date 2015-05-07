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
  "aws_iam_user_policies_url" : Server + "/aws/iam/users/${user_name}/policies" + TestQuery,
  "aws_iam_group_policies_url" : Server + "/aws/iam/groups/${group_name}/policies" + TestQuery,
  "basic_auth" : {
    "user" : "FILL_ME",
    "password" : "FILL_ME"
  },
  "aws_setting_url" : Server + "/aws/setting",
  "contact_support" : "Contact to support (@betahikaru).",
};

module.exports = ServerConfig;
