/**
 * AWS IAM Policy List Component
 */
'use strict';

var React = require('react-native');
var {
  ListView,
  Component,
  AlertIOS,
} = React;

var EventEmitter = require('EventEmitter');

var ServerConfig = require('../../config/ServerConfig');
var BasicAuthUtil = require('../util/BasicAuthUtil');
var SettingBudleModule = require('NativeModules').SettingBudleModule;
var Indicator = require('./Indicator');
var PolicyItem = require('./PolicyItem');

class PolicyList extends Component {

  constructor(props) {
    super(props);
    var dataSource = new ListView.DataSource(
      {rowHasChanged: (r1, r2) => r1.PolicyName !== r2.PolicyName});
    this.state = {
      dataSource: dataSource.cloneWithRows([]),
      loaded: false,
    };
    this.props = {
      url: ""
    };
  }

  renderRow(rowData, sectionID, rowID) {
    return (
      <PolicyItem
        onPress={() => {}}
        policyName={rowData.PolicyName}/>
    );
  }

  render() {
    if (!this.state.loaded) {
      return (
        <Indicator />
      );
    }
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRow.bind(this)}/>
    );
  }

  showAlertAndPop(alertTitle, errorMessage) {
    AlertIOS.alert(alertTitle, errorMessage, [{
      text: 'OK',
      onPress: () => this.props.navigator.pop(),
    }]);
  }

  componentDidMount() {
    var readSettingEmitter = new EventEmitter();
    readSettingEmitter.once('ReadSuccessEvent', (keyValues) => {
      this.fetchData(keyValues);
    });
    readSettingEmitter.once('ReadFailedEvent', (alertTitle, errorMessage) => {
      this.showAlertAndPop(alertTitle, errorMessage)
    });
    this._readApiSetting(readSettingEmitter);
  }

  _readApiSetting(readSettingEmitter) {
    SettingBudleModule.readApiSetting(
      (keyValues) => {
        readSettingEmitter.emit('ReadSuccessEvent', keyValues);
      },
      (errorMessage) => {
        readSettingEmitter.emit('ReadFailedEvent', 'Setting Error', errorMessage);
      }
    );
  }

  fetchData(keyValues) {
    /* Register _updateList() */
    var getDataEmitter = new EventEmitter();
    getDataEmitter.once('GetSuccessEvent', (responseData) => {
      if (!responseData) {
        console.log(responseData);
        this.showAlertAndPop('Fetch data Error', responseData.Error)
      } else {
        this._updateList(responseData);
      }
    });
    getDataEmitter.once('GetFailedEvent', (alertTitle, errorMessage) => {
      this.showAlertAndPop(alertTitle, errorMessage)
    });

    /* Register _fetchList */
    var pushSettingEmitter = new EventEmitter();
    pushSettingEmitter.once('PushSuccessEvent', () => {
      this._fetchList(getDataEmitter);
    });
    pushSettingEmitter.once('PushFailedEvent', (alertTitle, errorMessage) => {
      this.showAlertAndPop(alertTitle, errorMessage);
    });

    this._updateApiKeyOnServer(pushSettingEmitter, keyValues);
  }

  _updateApiKeyOnServer(pushSettingEmitter, keyValues) {
    var apiKey = "AWS_ACCESS_KEY_ID=" + encodeURIComponent(keyValues.textAwsAccessKeyId)
      + "&AWS_SECRET_ACCESS_KEY=" + encodeURIComponent(keyValues.textAwsSecretAccessKey);
    fetch(ServerConfig.aws_setting_url, {
      method: 'POST',
      headers: {
        Authorization: BasicAuthUtil.generateBasicAuthHeader()
      },
      body: apiKey
    })
    .then((response) => {
      console.log(response);
      if (!response) {
        throw ({
          message: "Internal error",
        });
      } else if(response.status != 200) {
        throw ({
          message: "Responce status = " + response.status + ". " + ServerConfig.contact_support,
        });
      } else {
        return response.json();
      }
    })
    .then((responseData) => {
      pushSettingEmitter.emit('PushSuccessEvent');
    })
    .catch((error) => {
      var title = 'Internal auth Error';
      var message = "";
      if (error == null) {
        message = "[Fetch] Internal Error";
      } else if (!error.message) {
        message = "[Fetch] " + error;
      } else {
        message = "[Fetch] " + error.message;
      }
      console.log(title + ":" + message);
      pushSettingEmitter.emit('PushFailedEvent', title, message);
    })
    .done();
  }

  _fetchList(getDataEmitter) {
    var getPoliciesUrl = this.props.url;
    fetch(getPoliciesUrl, {
      headers: {
        Authorization: BasicAuthUtil.generateBasicAuthHeader()
      }
    })
    .then((response) => {
      console.log(response);
      if (!response) {
        throw ({
          message: "Internal error",
        });
      } else if(response.status != 200) {
        throw ({
          message: "Network error : Responce status = " + response.status + ". " + ServerConfig.contact_support,
        });
      } else {
        return response.json();
      }
    })
    .then((responseData) => {
      getDataEmitter.emit('GetSuccessEvent', responseData);
    })
    .catch((error) => {
      var title = 'Fetch data Error';
      var message = "";
      if (error == null) {
        message = "[Fetch] Fatal Error";
      } else if (!error.message) {
        message = "[Fetch] " + error;
      } else {
        message = "[Fetch] " + error.message;
      }
      console.log(title + ":" + message);
      getDataEmitter.emit('GetFailedEvent', title, message);
    })
    .done();
  }

  _updateList(responseData) {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var policyList = [];
    var userPolicies = responseData.UserPolicies;
    if (userPolicies) {
      for (var i=0; i<userPolicies.length; i++) {
        policyList.push(userPolicies[i]);
      }
    }
    var groupPolicies = responseData.GroupPolicies;
    if (groupPolicies) {
      for (var i=0; i<groupPolicies.length; i++) {
        policyList.push(groupPolicies[i]);
      }
    }
    this.setState({
      dataSource: ds.cloneWithRows(policyList),
      loaded: true
    });
  }
}

module.exports = PolicyList;
