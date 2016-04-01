var React = require('react-native');
var { StyleSheet } = React;
module.exports = StyleSheet.create({
    //表格样式
    table: {
        borderWidth: .5,
        borderStyle: 'solid',
        borderColor: '#eeeeee'
    },

    tbTitleColor: {
        color: 'rgba(220, 220, 220, 1)',
    },

    tableRow: {
        flexDirection: 'row',
        height: 24,
    },

    tableRowEven: {
        backgroundColor: 'rgba(240, 240, 240, 1)'
    },

    tableCell: {
        flex:0.2,
        alignItems: 'center',
        justifyContent: 'center',
    },

    tableCellText: {
        fontSize: 12,
        color: 'rgba(50, 50, 50, 1)',
    },

    win1: {
        width: 12,
        height: 12,
        fontSize: 9,
        backgroundColor: 'rgba(255, 101, 101, 1)',
        color: 'white',
        textAlign: 'center',

    },

    win2: {
        width: 12,
        height: 12,
        fontSize: 9,
        backgroundColor: 'rgba(255, 147, 19, 1)',
        color: 'white',
        textAlign: 'center',
    },

    win3: {
        width: 12,
        height: 12,
        fontSize: 9,
        backgroundColor: 'rgba(255, 213, 0, 1)',
        color: 'white',
        textAlign: 'center',
    },

    winCom: {
        width: 12,
        height: 12,
        fontSize: 9,
        backgroundColor: 'rgba(150, 150, 150, 1)',
        color: 'white',
        textAlign: 'center',
    },

    //模块样式
    section: {
        marginBottom: 10,
        backgroundColor: 'rgba(250, 250, 250, 1)',
    },
    sectionItem: {
        padding: 10,
        flexDirection: 'row',
        alignItems: "center",
    },

    sectionTitle: {
        paddingLeft: 12.5,
        paddingRight: 12.5,
        height: 34,
        flexDirection: 'row',
        alignItems: "center",
        borderBottomWidth: .5,
        borderStyle: 'solid',
        borderBottomColor: '#eeeeee'
    },

    sectionTitleText: {
        fontSize: 15,
        color: 'rgba(50, 50, 50, 1)',
    },

    sectionTitleDetailCon: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'flex-end',
        flex: 1,
    },

    sectionTitleDetail: {
        fontSize: 13,
        color: 'rgba(150, 150, 150, 1)',
    },

    moreDetailImg: {
        width: 11,
        height: 11,
        marginLeft: 4,
    },

    //遮罩层
    overLayerCon: {
        flex: 1,
        marginBottom: 0,
        backgroundColor: 'rgba(250, 250, 250, 1)',
    },
    overLayHeader: {
        flexDirection: 'row',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },

    overLayHeaderText: {
        fontSize: 15,
        textAlign: 'center',
        flex:1,
    },

    overLayHeaderOpt: {
        width: 60,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },

    overLayerContent: {
        paddingRight: 12,
        paddingLeft: 12,
        paddingBottom: 12,
        flex: 1,
    }

})