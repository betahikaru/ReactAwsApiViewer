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
  textContainer: {
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: '#dddddd'
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Hiragino Kaku Gothic ProN',
    color: '#48BBEC'
  },
  arn: {
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
      var detailView = (
        <Text style={styles.arn}>{this.props.policyArn}</Text>
      );
    } else {
      var detailView = (
        <Text style={styles.arn}>-</Text>
      );
    }
    return (
      <TouchableHighlight
          onPress={() => this.props.onPress(policyName, this.props.policyArn, this.props.policyDocument)}
          underlayColor='#dddddd'>
        <View>
          <View style={styles.rowContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.name}>{policyName}</Text>
              {detailView}
            </View>
          </View>
          <View style={styles.separator}/>
        </View>
      </TouchableHighlight>
    );
  }

}

module.exports = PolicyItem;
