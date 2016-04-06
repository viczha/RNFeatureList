'use strict';

var React = require('react-native');

var {
    StyleSheet,
    WebView,
    } = React;

const hackScript = '<script>window.location.hash = 1;document.title = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);</script>';

class FlexiableWebView extends React.Component {
    constructor(props) {
        super();
        this.state = {
            height: 0
        };
    }

    onNavigationStateChange(navState) {
        this.setState({
            height: navState.title
        });
    }

    render() {
        var html = this.props.html || '';

        var HTML = '<!DOCTYPE html><html><head></head><body>'+ html + hackScript +'</body></html>'

        return (<WebView
            style={{height: Number(this.state.height),}}
            scrollEnabled={false}
            onNavigationStateChange={this.onNavigationStateChange.bind(this)}
            source={{html: HTML}}
        />)
    }
}

module.exports = FlexiableWebView;
