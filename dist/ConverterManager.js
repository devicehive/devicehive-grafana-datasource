'use strict';

System.register(['lodash'], function (_export, _context) {
    "use strict";

    var lodash, _createClass, ConverterManager;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [function (_lodash) {
            lodash = _lodash.default;
        }],
        execute: function () {
            _createClass = function () {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;
                        if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }

                return function (Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);
                    if (staticProps) defineProperties(Constructor, staticProps);
                    return Constructor;
                };
            }();

            ConverterManager = function () {
                function ConverterManager() {
                    _classCallCheck(this, ConverterManager);

                    var me = this;

                    me.converters = new Map();

                    me.converters.set('offset', {
                        arguments: [{ type: 'number', defaultValue: 0 }],
                        exec: function exec(a1, value) {
                            return a1 + value;
                        }
                    });

                    me.converters.set('scale', {
                        arguments: [{ type: 'number', defaultValue: 1 }],
                        exec: function exec(a1, value) {
                            return a1 * value;
                        }
                    });

                    var convertValueOptions = ConverterManager._getConvertOptions();
                    var convertTypeOptions = Object.keys(convertValueOptions);

                    me.converters.set('convert', {
                        arguments: [{ type: 'option', defaultValue: convertTypeOptions[0], options: convertTypeOptions }, { type: 'typedOption', defaultValue: convertValueOptions[convertTypeOptions[0]][0], options: convertValueOptions }, { type: 'typedOption', defaultValue: convertValueOptions[convertTypeOptions[0]][0], options: convertValueOptions }],
                        exec: function exec(a1, a2, a3, value) {
                            return ConverterManager._execConvert(a1, a2, a3, value);
                        }
                    });
                }

                _createClass(ConverterManager, [{
                    key: 'getConvertersMap',
                    value: function getConvertersMap() {
                        var me = this;

                        return me.converters;
                    }
                }, {
                    key: 'getConvertersList',
                    value: function getConvertersList() {
                        var me = this;
                        var result = [];

                        me.converters.forEach(function (value, key) {
                            result.push(Object.assign({ name: key }, value));
                        });

                        return result;
                    }
                }, {
                    key: 'getConvertersNameList',
                    value: function getConvertersNameList() {
                        var me = this;

                        return Array.from(me.converters.keys());
                    }
                }, {
                    key: 'getConverterObject',
                    value: function getConverterObject(converterName) {
                        var me = this;

                        return me.converters.get(converterName);
                    }
                }, {
                    key: 'getConverterDefaultValuesObject',
                    value: function getConverterDefaultValuesObject(converterName) {
                        var me = this;

                        return me.getConverterObject(converterName).arguments.reduce(function (obj, argument, index) {
                            obj[index] = argument.defaultValue;
                            return obj;
                        }, {});
                    }
                }, {
                    key: 'convert',
                    value: function convert(converterName, value, args) {
                        var me = this;
                        var result = value;

                        if (me.converters.has(converterName)) {
                            var converter = me.converters.get(converterName);
                            var exec = converter.arguments.reduce(function (execFunc, argument, index) {
                                return execFunc.bind(null, ConverterManager._castArgument(args[index], argument));
                            }, converter.exec);

                            result = exec(result);
                        }

                        return result;
                    }
                }], [{
                    key: '_castArgument',
                    value: function _castArgument(value, argument) {
                        var result = argument.defaultValue;

                        switch (argument.type) {
                            case 'number':
                                var castedValue = Number(value);
                                result = lodash.isNumber(castedValue) && !lodash.isNaN(castedValue) ? castedValue : result;
                                break;
                            case 'option':
                            case 'typedOption':
                                result = value;
                                break;
                        }

                        return result;
                    }
                }, {
                    key: '_getConvertOptions',
                    value: function _getConvertOptions() {
                        return {
                            temperature: ['C', 'F', 'K']
                        };
                    }
                }, {
                    key: '_execConvert',
                    value: function _execConvert(type, from, to, value) {
                        var result = value;

                        switch (type) {
                            case 'temperature':
                                result = ConverterManager._convertTemperature(from, to, value);
                                break;
                        }

                        return result;
                    }
                }, {
                    key: '_convertTemperature',
                    value: function _convertTemperature(from, to, value) {
                        var result = value;

                        switch (from + to) {
                            case 'CF':
                                result = value * 9 / 5 + 32;
                                break;
                            case 'CK':
                                result = value + 273.15;
                                break;
                            case 'FC':
                                result = (value - 32) * 5 / 9;
                                break;
                            case 'FK':
                                result = (value + 459.67) * 5 / 9;
                                break;
                            case 'KC':
                                result = value - 273.15;
                                break;
                            case 'KF':
                                result = value * 9 / 5 - 459.67;
                                break;
                        }

                        return result;
                    }
                }]);

                return ConverterManager;
            }();

            _export('default', ConverterManager);
        }
    };
});
//# sourceMappingURL=ConverterManager.js.map
