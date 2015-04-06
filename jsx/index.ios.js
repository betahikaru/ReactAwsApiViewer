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

var Menu = require('./component/Menu');

var AwsIamUserList = require('./sample/AwsIamUserList');
var UserList = require('./component/UserList');
var AwsIamGroupList = require('./sample/AwsIamGroupList');
var GroupList = require('./component/GroupList');

var ReactAwsApiViewer = React.createClass({
  render: function() {
    return (
      <NavigatorIOS
        style={styles.natigator}
        initialRoute={{
          component: Menu,
          title: 'Menu',
          passProps: {listings: [
              {
                ItemName: "Users",
                ItemTitle: "User List",
                ItemComponent: UserList,
                ItemUrl: "http://localhost:9292/aws/iam/users",
              },
              {
                ItemName: "Groups",
                ItemTitle: "Group List",
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
