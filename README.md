ReactAwsApiViewer
=================

AWS の管理情報を参照するための、個人開発者向けのiOSアプリです。

## Motivation

- 身に覚えのない高額請求を受けないために、IAMのお金が発生する操作ができるユーザは把握したい。
  - が、IAMのページでユーザごとに確認するの面倒。
- マネジメントコンソール/公式アプリだと、（個人ユーザには）情報多すぎて欲しい情報にたどり着けない。

## Solution
- 権限の一覧を簡単に見えるようにする。強い権限を持っているユーザがいたら、定期的に知らせる。棚卸しできるようにする。
- 必要な情報を厳選し、それらを表示する。

## Architecture
- Client: ReactNative
- Server: aws-sdk-ruby(v2), Sinatra, heroku

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
