'use strict'

var EventEmitter = require('./EventEmiter');

var __export___ = {
    isEmptyObject: function(obj) {
        var hasOwnProperty = Object.prototype.hasOwnProperty;
        if (obj == null) return true;

        if (obj.length > 0)    return false;
        if (obj.length === 0)  return true;

        for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) return false;
        }
        return true;
    }
}

__export___.EventEmitter = EventEmitter;

module.exports = __export___;
