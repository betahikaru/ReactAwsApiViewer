/**
 * AWS IAM Group List Component
 */
'use strict';

var React = require('react-native');

// Config
var ServerConfig = require('../../config/ServerConfig');

// Components
var FetchedList = require('./FetchedList');
var PolicyList = require('./PolicyList');
var GroupItem = require('./GroupItem');

class GroupList extends FetchedList {

  renderRow(rowData, sectionID, rowID) {
    return (
      <GroupItem
        onPress={this._onPressed.bind(this)}
        groupName={rowData.GroupName}/>
    );
  }

  _onPressed(groupName) {
    var url = ServerConfig.aws_iam_group_policies_url.replace("${group_name}", groupName);
    this.props.navigator.push({
      title: groupName + "'s policies",
      component: PolicyList,
      passProps: {
        url: url,
      },
    });
  }

  updateList(responseData, dataSource) {
    var list = [];
    var groups = responseData.Groups;
    for (var group of groups) {
      group.sortKey = group.GroupName;
      list.push(group);
    }
    this.setState({
      dataSource: dataSource.cloneWithRows(list),
      loaded: true
    });
  }

  validateListData(responseData) {
    if (responseData.Groups) {
      return true;
    } else {
      return false;
    }
  }
}

module.exports = GroupList;
