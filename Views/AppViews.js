'use strict'

var util = require('../Common/JSUtils');

var views = {
    BasicList: require('./BasicList'),
    MyLibList: require('./MyLibList'),
    ThirdPartyList: require('./ThirdPartyList')
}

//basic
util.extend(views, {
    CptInfo: require('./Basic/CptInfo'),
    TeamInfo: require('./Basic/TeamInfo')
});

//my lib
util.extend(views, {
    InputKeyBoard: require('./MyLib/inputKeyboard'),
    PullToRefreshView: require('./MyLib/PullToRefreshView')
});

//3rd
util.extend(views, {
    Game2048: require('./3rd/Game2048'),
    ScrollableView: require('./3rd/ScrollableView'),
    NavigationExample: require('../UIExample/Navigator/NavigatorExample'),
});

module.exports = views;
