import React, {
    Component,
    StyleSheet,
    Text,
    View
} from 'react-native';

var RefreshableScrollView = require('../UIComponent/RefreshableScrollView');


class ScrollableView extends Component {
    render() {
        return (
            <View>
                <View  style={{height: 100}}></View>
                <RefreshableScrollView
                    ref={(scrollView) => {this.scrollView = scrollView}}
                    style={{height: 600}}
                    onBeginRefresh={(callback)=>{
                    setTimeout(() => {
                        callback();
                    }, 3000);
                }}
                >
                    <View style={{height: 1000}}></View>
                </RefreshableScrollView>
            </View>

        );
    }
}

module.exports = ScrollableView;