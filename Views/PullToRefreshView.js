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
            <RefreshableScrollView
                ref={(scrollView) => {this.scrollView = scrollView}}
                style={{flex: 1}}
                renderScrollContent={() => (<View style={{height: 2000, backgroundColor: 'white'}}></View>)}
                _onRefreshStart={()=>{
                    setTimeout(() => {
                         this.scrollView.setState({refreshing: false})
                    }, 3000);
                }}
            >

            </RefreshableScrollView>
        );
    }
}

module.exports = ScrollableView;
