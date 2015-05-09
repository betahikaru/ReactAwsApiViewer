/**
 * AWS IAM Policy List Component
 */
'use strict';

var React = require('react-native');

// Components
var FetchedList = require('./FetchedList');
var PolicyItem = require('./PolicyItem');

class PolicyList extends FetchedList {

  renderRow(rowData, sectionID, rowID) {
    return (
      <PolicyItem
        onPress={() => {}}
        policyName={rowData.PolicyName}/>
    );
  }

  updateList(responseData, dataSource) {
    var list = [];
    var userPolicies = responseData.UserPolicies;
    if (userPolicies) {
      for (var policy of userPolicies) {
        policy.sortKey = policy.PolicyName;
        list.push(policy);
      }
    }
    var groupPolicies = responseData.GroupPolicies;
    if (groupPolicies) {
      for (var policy of groupPolicies) {
        policy.sortKey = policy.PolicyName;
        list.push(policy);
      }
    }
    this.setState({
      dataSource: dataSource.cloneWithRows(list),
      loaded: true
    });
  }

  validateListData(responseData) {
    if (responseData.UserPolicies || responseData.GroupPolicies) {
      return true;
    } else {
      return false;
    }
  }
}

module.exports = PolicyList;
