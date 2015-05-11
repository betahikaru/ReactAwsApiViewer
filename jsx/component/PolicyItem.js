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
  doc: {
    fontSize: 12,
    color: '#222222'
  },
});

class PolicyItem extends Component {

  constructor(props) {
    super(props);
    this.props = {
      onPress: props.onPress,
      policyArn: props.policyArn,
      policyDocument: props.policyDocument,
      policyName: props.policyName,
    };
  }

  render() {
    var policyName = this.props.policyName;
    var detailView;
    if (this.props.policyArn) {
      detailView = (
        <Text style={styles.arn}>{this.props.policyArn}</Text>
      );
    } else if (this.props.policyDocument) {
      var doc = this.props.policyDocument;
      var decodedDoc = decodeURIComponent(doc);
      detailView = (
        <Text style={styles.doc}>{decodedDoc}</Text>
      );
    } else {
      detailView = (
        <Text></Text>
      );
    }
    return (
      <TouchableHighlight
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
