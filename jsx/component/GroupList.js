/**
 * AWS IAM Group List Component
 */
'use strict';

var React = require('react-native');
var {
  ListView,
  Component,
  AlertIOS,
} = React;

var NativeModules = require('NativeModules');
var {
  SettingBudleModule,
  OpenSettingAppModule,
} = NativeModules;

var EventEmitter = require('EventEmitter');

var ServerConfig = require('../../config/ServerConfig');
var BasicAuthUtil = require('../util/BasicAuthUtil');
var Indicator = require('./Indicator');
var GroupItem = require('./GroupItem');
var PolicyList = require('./PolicyList'); // FIXME:

class GroupList extends Component {

  constructor(props) {
    super(props);
    var dataSource = new ListView.DataSource(
      {rowHasChanged: (r1, r2) => r1.GroupName !== r2.GroupName});
    this.state = {
      dataSource: dataSource.cloneWithRows([]),
      loaded: false,
    };
    this.props = {
      url: ""
    };
  }

  onPolicyPressed(groupName) {
    var url = ServerConfig.aws_iam_group_policies_url.replace("${group_name}", groupName);
    this.props.navigator.push({
      title: groupName + "'s Policies",
      component: PolicyList,
      passProps: {
        url: url,
      },
    });
  }

  renderRow(rowData, sectionID, rowID) {
    return (
      <GroupItem
        onPress={this.onPolicyPressed.bind(this)}
        groupName={rowData.GroupName}/>
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

  showAlertAndPopWithJumpSettingsButton(alertTitle, errorMessage) {
    AlertIOS.alert(alertTitle, errorMessage, [
      {
        text: 'OK',
        onPress: () => this.props.navigator.pop(),
      },
      {
        text: 'Setting',
        onPress: () => {
          OpenSettingAppModule.openSettingsApp(
            (result) => {
              this.props.navigator.pop();
            }
          );
        },
      }
    ]);
  }

  onBadSettings(alertTitle, errorMessage) {
    OpenSettingAppModule.canOpenSettingsApp(
      (canOpen, iosVersion) => {
        console.log(iosVersion);
        if (canOpen) {
          this.showAlertAndPopWithJumpSettingsButton(alertTitle, errorMessage);
        } else {
          this.showAlertAndPop(alertTitle, errorMessage);
        }
      }
    );
  }

  componentDidMount() {
    var readSettingEmitter = new EventEmitter();
    readSettingEmitter.once('ReadSuccessEvent', (keyValues) => {
      this.fetchData(keyValues);
    });
    readSettingEmitter.once('ReadFailedEvent', (alertTitle, errorMessage) => {
      this.onBadSettings(alertTitle, errorMessage);
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
      if (!responseData.Groups) {
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
    var getGroupsUrl = this.props.url;
    fetch(getGroupsUrl, {
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
    this.setState({
      dataSource: ds.cloneWithRows(responseData.Groups),
      loaded: true
    });
  }
}

module.exports = GroupList;
