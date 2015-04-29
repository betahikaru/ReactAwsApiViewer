/**
 * Menu Component
 */
'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Image,
  View,
  TouchableHighlight,
  ListView,
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

class Menu extends Component {

  constructor(props) {
    super(props);
    var dataSource = new ListView.DataSource(
      {rowHasChanged: (r1, r2) => r1.ItemName !== r2.ItemName});
    this.state = {
      dataSource: dataSource.cloneWithRows(this.props.listings)
    };
    this.props = {
      imageName: props.imageName,
    };
  }

  onItemPressed(item) {
    var property = this.props.listings.filter(prop => prop.ItemName === item.ItemName)[0];
    this.props.navigator.push({
      title: property.ItemTitle,
      component: property.ItemComponent,
      passProps: {
        url: property.ItemUrl,
      },
    });
  }

  renderRow(rowData, sectionID, rowID) {
    return (
      <TouchableHighlight
          onPress={() => this.onItemPressed(rowData)}
          underlayColor='#dddddd'>
        <View>
          <View style={styles.rowContainer}>
            <View style={styles.imageContainer}>
              <Image source={require('image!aws_icon_iam')} style={styles.itemimage} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.itemname}>{rowData.ItemName}</Text>
            </View>
          </View>
          <View style={styles.separator}/>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRow.bind(this)}/>
    );
  }

}

module.exports = Menu;
