var is = require('is');

module.exports = {
    isEmptyObject: function(obj) {
        var hasOwnProperty = Object.prototype.hasOwnProperty;
        if (obj == null) return true;

        if (obj.length > 0)    return false;
        if (obj.length === 0)  return true;

        for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) return false;
        }
        return true;
    },
    extend: function() {
        var target = arguments[0] || {};
        var i = 1;
        var length = arguments.length;
        var deep = false;
        var options, name, src, copy, copy_is_array, clone;

        // Handle a deep copy situation
        if (typeof target === 'boolean') {
            deep = target;
            target = arguments[1] || {};
            // skip the boolean and the target
            i = 2;
        }

        // Handle case when target is a string or something (possible in deep copy)
        if (typeof target !== 'object' && !is.fn(target)) {
            target = {};
        }

        for (; i < length; i++) {
            // Only deal with non-null/undefined values
            options = arguments[i]
            if (options != null) {
                if (typeof options === 'string') {
                    options = options.split('');
                }
                // Extend the base object
                for (name in options) {
                    src = target[name];
                    copy = options[name];

                    // Prevent never-ending loop
                    if (target === copy) {
                        continue;
                    }

                    // Recurse if we're merging plain objects or arrays
                    if (deep && copy && (is.hash(copy) || (copy_is_array = is.array(copy)))) {
                        if (copy_is_array) {
                            copy_is_array = false;
                            clone = src && is.array(src) ? src : [];
                        } else {
                            clone = src && is.hash(src) ? src : {};
                        }

                        // Never move original objects, clone them
                        target[name] = extend(deep, clone, copy);

                        // Don't bring in undefined values
                    } else if (typeof copy !== 'undefined') {
                        target[name] = copy;
                    }
                }
            }
        }

        // Return the modified object
        return target;
    },
}