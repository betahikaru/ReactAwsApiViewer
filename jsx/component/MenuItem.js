/**
 * Menu Item Component
 */
'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Image,
  View,
  TouchableHighlight,
  Text,
  Component
} = React;

var styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    padding: 2,
  },
  textContainer: {
    padding: 6,
  },
  imageContainer: {
    width: 32,
    height: 26,
    padding: 2,
  },
  separator: {
    height: 1,
    backgroundColor: '#dddddd'
  },
  itemname: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Hiragino Kaku Gothic ProN',
    color: '#48BBEC'
  },
  itemimage: {
    width: 24,
    height: 24,
    resizeMode: Image.resizeMode.cover,
  },
});

class MenuItem extends Component {

  constructor(props) {
    super(props);
    this.props = {
      onPress: props.onPress,
      itemName: props.itemName,
      imageIcon: props.imageIcon,
    };
  }

  render() {
    var itemName = this.props.itemName;
    var imageIcon = this.props.imageIcon;
    return (
      <TouchableHighlight
          onPress={() => this.props.onPress(itemName)}
          underlayColor='#dddddd'>
        <View>
          <View style={styles.rowContainer}>
            <View style={styles.imageContainer}>
              <Image source={imageIcon} style={styles.itemimage} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.itemname}>{itemName}</Text>
            </View>
          </View>
          <View style={styles.separator}/>
        </View>
      </TouchableHighlight>
    );
  }

}

module.exports = MenuItem;
