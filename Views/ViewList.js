import React, {
    Component,
    StyleSheet,
    Text,
    View,
    ListView,
    TouchableOpacity,
    Navigator,
    Image
} from 'react-native';

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
            title: 'team info',
            componentName: 'TeamInfo',
            index: 2
        })

        rows.push({
            title: 'Cpt info',
            componentName: 'CptInfo',
            index: 4
        })

        rows.push({
            title: '2048',
            componentName: 'Game2048',
            index: 0,
            hasHeader: true
        })

        rows.push({
            title: 'Scrollable View Sample',
            componentName: 'ScrollableView',
            index: 1
        })



        rows.push({
            title: 'Refresh View',
            componentName: 'PullToRefreshView',
            index: 3
        })

        rows.push({
            title: 'Navigation Example',
            componentName: 'NavigationExample',
            index: 5,
            hasHeader: true
        })

        return rows;
    }

    goPage(rowData) {
        this.props.navigator.push({
            name: 'ddd',
            index: 1,
            componentName: rowData.componentName,
            hasHeader: rowData.hasHeader || false
        });
    }

    renderRow(rowData, sectionID, rowID) {
        return (
            <TouchableOpacity onPress={()=>this.goPage(rowData)}>
                <View style={styles.row}>
                    <Text style={styles.rowText}>{rowData.title}</Text>
                    <Image style={styles.moreDetailImg} source={require('../Src/Images/home_arrow_icon@2x.png')} />
                </View>
            </TouchableOpacity>

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
        )
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
        flexDirection: 'row',
        height: 50,
        paddingTop: 7,
        paddingBottom: 7,
        paddingLeft: 12,
        paddingRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderColor: '#eeeeee'
    },

    rowText: {
        flex: 1,
        fontSize: 15,
    },

    moreDetailImg: {
        width: 11,
        height: 11,
    }
});

module.exports = ViewList;