import React, {
    Component,
    StyleSheet,
    Text,
    View,
    ListView,
    TouchableHighlight
} from 'react-native';

var appViews = require('./AppViews');

class ViewList extends Component {
    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) =>  r1.index !== r2.index});
        this.state = {
            dataSource: ds.cloneWithRows(this.genRows())
        }
    }

    genRows() {
        var rows = [];

        rows.push({
            title: '2048',
            componentName: 'Game2048',
            index: 0
        })

        rows.push({
            title: 'Scrollable View Sample',
            componentName: 'ScrollableView',
            index: 1
        })

        rows.push({
            title: 'team info',
            componentName: 'TeamInfo',
            index: 2
        })

        rows.push({
            title: 'Refresh View',
            componentName: 'PullToRefreshView',
            index: 3
        })

        return rows;
    }

    goPage(rowData) {
        this.props.navigator.push({
            name: 'ddd',
            index: 1,
            componentName: rowData.componentName
        });
    }

    renderRow(rowData, sectionID, rowID) {
        return (
            <TouchableHighlight onPress={()=>this.goPage(rowData)}>
                <View style={styles.row}>
                    <Text>{rowData.title}</Text>
                </View>
            </TouchableHighlight>

        );
    }

    render() {
        return (
            <View style={styles.container}>
                <ListView
                    style={styles.list}
                    dataSource = {this.state.dataSource}
                    renderRow = {this.renderRow.bind(this)}
                />
            </View>
        );
    }
}


var styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50
    },

    list: {
        flex: 1,
    },

    row: {
        flex: 1,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

module.exports = ViewList;