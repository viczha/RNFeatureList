'use strict'

var React = require('react-native');

var {
    View,
    TabBarIOS,
    StyleSheet,
    Platform,
    TouchableOpacity,
    Text,
    } = React;

var Icon = require('react-native-vector-icons/FontAwesome');

module.exports = class Tabbar extends React.Component {
    constructor(props) {
        super(props)
    }

    render(){
        if (Platform.OS == 'android'){
            return(
                <View style={[styles.tabs, {flexDirection: 'row'}]}>
                    {
                        this.props.items.map((item, i) => {
                            return ( <TouchableOpacity
                                    key={i}
                                    onPress={item.onPress}
                                    style={{flex: 1/this.props.items.length, height: 50, alignItems:'center', justifyContent: 'center'}}>
                                <Icon name={item.icon}
                                      size={25}
                                      color={item.selected ? 'green' : 'gray'} />
                                <Text >
                                    {item.title}
                                </Text>
                            </TouchableOpacity>)
                        })
                    }
                </View>
            );
        }
        return(
            <TabBarIOS>
                {
                    this.props.items.map((item, i) => {
                        return (<Icon.TabBarItemIOS
                            key={i}
                            iconName={item.icon}
                            title={item.title}
                            selected={item.selected}
                            onPress={item.onPress}>
                            <View />
                        </Icon.TabBarItemIOS>)
                    })
                }
            </TabBarIOS>
        );
    }
};

var styles = StyleSheet.create({
});
