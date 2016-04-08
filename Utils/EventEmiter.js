'use strict'

var _events = function () {
    var topics = {},
        uuid = 0;
    this.listen = function (topic, callback) {
        if (typeof topic !== "string" || typeof callback !== "function")
            return this;
        if (!topics[topic]) {
            topics[topic] = [];
        }
        callback.uuid = uuid++;
        topics[topic].push(callback);
        return this;
    };
    this.trigger = function (src, topic, data) {
        if (!topics[topic] || topics[topic].length === 0)
            return this;
        var callbacks = topics[topic],
            i = 0,
            length = callbacks.length;
        for (; i < length; i++) {
            callbacks[i].call(src, data);
        }
        return this;
    };
    this.remove = function (topic, callback) {
        if (!topics[topic] || topics[topic].length === 0)
            return this;
        var callbacks = topics[topic],
            i = 0,
            length = callbacks.length;
        for (; i < length; i++) {
            if (callback.uuid === callbacks[i].uuid)
                callbacks.splice(i, 1);
        }
        return this;
    };
    this.removeAll = function() {
        topics = {};
        uuid = 0;
    };
}

module.exports = _events;