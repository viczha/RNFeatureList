import React, {
    Component,
    StyleSheet,
    Text,
    View
} from 'react-native';

var RCTMap = require('../NativeUIComponent/MapView');

class MapView extends Component {
    render() {
        return (
            <RCTMap style={{width: 600, height: 400}} pitchEnabled={false} />
        );
    }
}

module.exports = MapView;
