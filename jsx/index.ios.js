/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,

  NavigatorIOS,
} = React;

// Components
var Menu = require('./component/Menu');
var UserList = require('./component/UserList');
var GroupList = require('./component/GroupList');

// Config
var ServerConfig = require('../config/ServerConfig');
var AwsIamGroupList = require('./sample/AwsIamGroupList');

var ReactAwsApiViewer = React.createClass({
  render: function() {
    return (
      <NavigatorIOS
        style={styles.natigator}
        initialRoute={{
          component: Menu,
          title: 'AWS APIs',
          passProps: {listings: [
              {
                ItemName: "IAM Users",
                ItemTitle: "IAM Users",
                ItemComponent: UserList,
                ItemUrl: ServerConfig.aws_iam_users_url,
              },
              {
                ItemName: "IAM Groups",
                ItemTitle: "IAM Groups",
                ItemComponent: GroupList,
                ItemData: AwsIamGroupList.Groups,
              },
            ]},
        }}
        tintColor="#4A90C7"
      />
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  natigator: {
    flex: 1,
  },
});

AppRegistry.registerComponent('ReactAwsApiViewer', () => ReactAwsApiViewer);
