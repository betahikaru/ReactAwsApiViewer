/**
 * AWS IAM Policy Item Component
 */
'use strict';

var React = require('react-native');
var {
  StyleSheet,
  View,
  TouchableHighlight,
  Text,
  Component,
} = React;

var styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  textContainer: {
    flex: 1,
  },
  iconContainer: {
    width: 16,
    height: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#dddddd'
  },
  name: {
    fontSize: 14,
    fontFamily: 'Hiragino Kaku Gothic ProN',
    color: '#111111'
  },
  tappableName: {
    fontSize: 14,
    fontFamily: 'Hiragino Kaku Gothic ProN',
    fontWeight: 'bold',
    color: '#48BBEC'
  },
  kind: {
    fontSize: 12,
    padding: 2,
    color: '#999999'
  },
  value: {
    fontSize: 14,
    color: '#333222'
  },
  arrow: {
    fontSize: 14,
    color: '#333222'
  },
});

class PolicyItem extends Component {

  constructor(props) {
    super(props);
    this.props = {
      onPress: props.onPress,
      policyName: props.policyName,
      policyArn: props.policyArn,
      policyDocument: props.policyDocument,
    };
  }

  render() {
    var policyName = this.props.policyName;
    if (this.props.policyArn) {
      var nameView = (
        <View style={styles.textContainer}>
          <Text style={styles.name}>{policyName}</Text>
          <View style={styles.row}>
            <View style={{flex: 1}}>
              <Text style={styles.kind}>{"Type: "}</Text>
            </View>
            <View style={{flex: 9}}>
              <Text style={styles.value}>{"Managed Policy"}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={{flex: 1}}>
              <Text style={styles.kind}>{"Arn: "}</Text>
            </View>
            <View style={{flex: 9}}>
              <Text style={styles.value}>{this.props.policyArn}</Text>
            </View>
          </View>
        </View>
      );
    } else {
      var nameView = (
        <View style={styles.textContainer}>
          <Text style={styles.tappableName}>{policyName}</Text>
          <View style={styles.row}>
            <View style={{flex: 1}}>
              <Text style={styles.kind}>{"Type: "}</Text>
            </View>
            <View style={{flex: 9}}>
              <Text style={styles.value}>{"Inline Policy"}</Text>
            </View>
          </View>
        </View>
      );
    }
    return (
      <TouchableHighlight
          onPress={() => this.props.onPress(policyName, this.props.policyArn, this.props.policyDocument)}
          underlayColor='#dddddd'>
        <View>
          <View style={styles.rowContainer}>
            {nameView}
          </View>
          <View style={styles.separator}/>
        </View>
      </TouchableHighlight>
    );
  }

}

module.exports = PolicyItem;
