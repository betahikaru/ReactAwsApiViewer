ReactAwsApiViewer
=================

AWS の管理情報を参照するための、個人開発者向けのiOSアプリです。

## Motivation

- 身に覚えのない高額請求を受けないために、IAMのお金が発生する操作ができるユーザは把握したい。
  - IAMのページでユーザごとに確認するの面倒。
  - 管理しないとAWSにも自分にも被害が及ぶ。
- 被害例
  - [AWSアカウントに関する不正使用を整理してみた](http://www.slideshare.net/naotokatsumi/20150221-aws-accountsabuse-44977667)
  - [AWS で不正アクセスされて凄い額の請求が来ていた件](http://d.hatena.ne.jp/yoya/20150404/aws)

## Solution
- IAM管理のノウハウ
  - [AWS アクセスキーを管理するためのベストプラクティス (公式)](http://docs.aws.amazon.com/ja_jp/general/latest/gr/aws-access-keys-best-practices.html)
  - [AWS で請求金額にビックリしないようにやっておくべきこと](http://www.1x1.jp/blog/2015/03/how-to-avoid-surprise-for-aws-billing.html)
- このアプリでできる（ようになる予定の）こと
  - 権限の一覧を簡単に見えるようにする。強い権限を持っているユーザがいたら、定期的に知らせる。棚卸しできるようにする。

## Architecture
- Client: ReactNative
  - Github repo: [facebook/react-native](https://github.com/facebook/react-native)
- Server: aws-sdk-ruby(v2), Sinatra, heroku
  - Github repo: [betahikaru/aws-rest-server](https://github.com/betahikaru/aws-rest-server)

## Get Start

OS X only.

```shell
brew update
brew install watchman
brew install flow
npm install -g react-native-cli
git clone git@github.com:betahikaru/ReactAwsApiViewer.git
cd ReactAwsApiViewer
npm install
open ReactAwsApiViewer.xcodeproj
```

## License
MIT
