/**
 * aws iam list-users
 */
'use strict';

var AwsIamUserList =
{
    "Users": [
        {
            "UserName": "aws_user1",
            "Path": "/",
            "CreateDate": "2014-05-23T14:46:39Z",
            "UserId": "USER1XXXXXXXXXXXXXXXX",
            "Arn": "arn:aws:iam::123456789012:user/aws_user1"
        },
        {
            "UserName": "aws_user2_with_password",
            "PasswordLastUsed": "2015-04-05T03:57:38Z",
            "CreateDate": "2014-06-28T11:59:49Z",
            "UserId": "USER2XXXXXXXXXXXXXXXX",
            "Path": "/",
            "Arn": "arn:aws:iam::123456789012:user/aws_user2_with_password"
        },
        {
            "UserName": "aws_user3",
            "Path": "/",
            "CreateDate": "2014-05-23T14:46:39Z",
            "UserId": "USER3XXXXXXXXXXXXXXXX",
            "Arn": "arn:aws:iam::123456789012:user/aws_user3"
        },
        {
            "UserName": "aws_user4",
            "Path": "/",
            "CreateDate": "2014-05-23T14:46:39Z",
            "UserId": "USER4XXXXXXXXXXXXXXXX",
            "Arn": "arn:aws:iam::123456789012:user/aws_user4"
        },
        {
            "UserName": "aws_user5",
            "Path": "/",
            "CreateDate": "2014-05-23T14:46:39Z",
            "UserId": "USER5XXXXXXXXXXXXXXXX",
            "Arn": "arn:aws:iam::123456789012:user/aws_user5"
        },
        {
            "UserName": "aws_user6",
            "Path": "/",
            "CreateDate": "2014-05-23T14:46:39Z",
            "UserId": "USER6XXXXXXXXXXXXXXXX",
            "Arn": "arn:aws:iam::123456789012:user/aws_user6"
        },
        {
            "UserName": "aws_user7",
            "Path": "/",
            "CreateDate": "2014-05-23T14:46:39Z",
            "UserId": "USER7XXXXXXXXXXXXXXXX",
            "Arn": "arn:aws:iam::123456789012:user/aws_user7"
        },
    ]
};

module.exports = AwsIamUserList;
