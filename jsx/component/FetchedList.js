/**
 * Common Fetch Data List Component
 */
'use strict';

var React = require('react-native');
var {
  ListView,
  Text,
  Component,
  AlertIOS,
  NativeModules,
} = React;
var {
  SettingBudleModule,
  OpenSettingAppModule,
} = NativeModules;

var EventEmitter = require('EventEmitter');
var ServerConfig = require('../../config/ServerConfig');
var BasicAuthUtil = require('../util/BasicAuthUtil');
var Indicator = require('./Indicator');

class FetchedList extends Component {

  /* Override me */
  renderRow(rowData, sectionID, rowID) {
    return (
      <Text>
        {rowData.sortKey} {sectionID} {rowID}
      </Text>
    );
  }

  /* Override me */
  updateList(responseData, dataSource) {
    var list = [{
      sortKey: "key",
    }];
    this.setState({
      dataSource: dataSource.cloneWithRows(list),
      loaded: true
    });
  }

  /* Override me */
  validateListData(responseData) {
    if (responseData) {
      return true;
    } else {
      return false;
    }
  }

   /***********************/
   /* Component functions */
   /***********************/

  constructor(props) {
    super(props);
    var dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1.sortKey !== r2.sortKey
    });
    this.state = {
      dataSource: dataSource.cloneWithRows([]),
      loaded: false,
    };
    this.props = {
      url: ""
    };
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

  /**
   * Process Flow
   * 1. Read API Key and Secret Access Key.
   *    If failed to read, show alert and pop navigation.
   * 2. Set API Key and Secret Access Key to Session (post to "/aws/setting").
   *    If failed to post, show alert and pop navigation.
   * 3. Fetch List Data (get from server, like "/aws/xxxs", "/aws/xxxs/:name/xxxs").
   *    If failed to get, show alert and pop navigation.
   * 4. Update List Data.
   */
  componentDidMount() {
    var readSettingEmitter = new EventEmitter();
    readSettingEmitter.once('ReadSuccessEvent', (keyValues) => {
      this._fetchData(keyValues);
    });
    readSettingEmitter.once('ReadFailedEvent', (alertTitle, errorMessage) => {
      this._onBadSettings(alertTitle, errorMessage);
    });
    this._readApiSetting(readSettingEmitter);
  }

  /*******************/
  /* Inner functions */
  /*******************/

  _onBadSettings(alertTitle, errorMessage) {
    OpenSettingAppModule.canOpenSettingsApp(
      (canOpen, iosVersion) => {
        console.log(iosVersion);
        if (canOpen) {
          this._showAlertAndPopWithJumpSettingsButton(alertTitle, errorMessage);
        } else {
          this._showAlertAndPop(alertTitle, errorMessage);
        }
      }
    );
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

  _fetchData(keyValues) {
    /* Register updateList() */
    var getDataEmitter = new EventEmitter();
    getDataEmitter.once('GetSuccessEvent', (responseData) => {
      var isValidData = this.validateListData(responseData);
      if (!isValidData) {
        console.log(responseData);
        this._showAlertAndPop('Fetch data Error', responseData.Error)
      } else {
        var dataSource = new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1.sortKey !== r2.sortKey
        });
        this.updateList(responseData, dataSource);
      }
    });
    getDataEmitter.once('GetFailedEvent', (alertTitle, errorMessage) => {
      this._showAlertAndPop(alertTitle, errorMessage)
    });

    /* Register _fetchList */
    var pushSettingEmitter = new EventEmitter();
    pushSettingEmitter.once('PushSuccessEvent', () => {
      this._fetchList(getDataEmitter);
    });
    pushSettingEmitter.once('PushFailedEvent', (alertTitle, errorMessage) => {
      this._showAlertAndPop(alertTitle, errorMessage);
    });

    this._updateApiKeyOnServer(pushSettingEmitter, keyValues);
  }

  _generateApiKey(keyValues) {
    var apiKey = "AWS_ACCESS_KEY_ID=" + encodeURIComponent(keyValues.textAwsAccessKeyId)
      + "&AWS_SECRET_ACCESS_KEY=" + encodeURIComponent(keyValues.textAwsSecretAccessKey);
    return apiKey;
  }

  _updateApiKeyOnServer(pushSettingEmitter, keyValues) {
    fetch(ServerConfig.aws_setting_url, {
      method: 'POST',
      headers: {
        Authorization: BasicAuthUtil.generateBasicAuthHeader()
      },
      body: this._generateApiKey(keyValues)
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
    var fetchUrl = this.props.url;
    fetch(fetchUrl, {
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

  _showAlertAndPop(alertTitle, errorMessage) {
    AlertIOS.alert(alertTitle, errorMessage, [{
      text: 'OK',
      onPress: () => this.props.navigator.pop(),
    }]);
  }

  _showAlertAndPopWithJumpSettingsButton(alertTitle, errorMessage) {
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

}

module.exports = FetchedList;
