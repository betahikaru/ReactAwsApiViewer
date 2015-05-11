/**
 * AWS IAM User List Component
 */
'use strict';

var React = require('react-native');

// Config
var ServerConfig = require('../../config/ServerConfig');

// Components
var FetchedList = require('./FetchedList');
var PolicyList = require('./PolicyList');
var UserItem = require('./UserItem');

class UserList extends FetchedList {

  renderRow(rowData, sectionID, rowID) {
    return (
      <UserItem
        onPress={this._onPressed.bind(this)}
        userName={rowData.UserName}/>
    );
  }

  _onPressed(userName) {
    var url = ServerConfig.aws_iam_user_policies_url.replace("${user_name}", userName);
    this.props.navigator.push({
      title: userName + "'s policies",
      component: PolicyList,
      passProps: {
        url: url,
      },
    });
  }

  updateList(responseData, dataSource) {
    var list = [];
    var users = responseData.Users;
    for (var i=0; i<users.length; i++) {
      var user = users[i]
      user.sortKey = user.Username;
      list.push(user);
    }
    this.setState({
      dataSource: dataSource.cloneWithRows(list),
      loaded: true
    });
  }

  validateListData(responseData) {
    if (responseData.Users) {
      return true;
    } else {
      return false;
    }
  }
}

module.exports = UserList;
