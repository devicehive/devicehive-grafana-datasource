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

                /**
                 * Create new ConverterManager
                 */
                function ConverterManager() {
                    _classCallCheck(this, ConverterManager);

                    var me = this;

                    me.converters = new Map();

                    me.converters.set('Offset', {
                        arguments: [{ type: 'number', defaultValue: 0 }],
                        exec: function exec(a1, value) {
                            return a1 + value;
                        }
                    });

                    me.converters.set('Scale', {
                        arguments: [{ type: 'number', defaultValue: 1 }],
                        exec: function exec(a1, value) {
                            return a1 * value;
                        }
                    });

                    var convertValueOptions = ConverterManager.getUnitConvertOptions();
                    var convertTypeOptions = Object.keys(convertValueOptions);

                    me.converters.set('Unit converter', {
                        arguments: [{ type: 'option', defaultValue: convertTypeOptions[0], options: convertTypeOptions }, { type: 'typedOption', defaultValue: convertValueOptions[convertTypeOptions[0]][0], options: convertValueOptions }, { type: 'typedOption', defaultValue: convertValueOptions[convertTypeOptions[0]][0], options: convertValueOptions }],
                        exec: function exec(a1, a2, a3, value) {
                            return ConverterManager._execUnitConvert(a1, a2, a3, value);
                        }
                    });
                }

                /**
                 * Returns converters Map
                 * @returns {Map}
                 */


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
                    key: 'getUnitConvertOptions',
                    value: function getUnitConvertOptions() {
                        return {
                            temperature: ['C', 'F', 'K'],
                            length: ['m', 'mi', 'yd', 'ft', 'in'],
                            weight: ['kg', 'lb', 'oz'],
                            volume: ['l', 'gal', 'pt']
                        };
                    }
                }, {
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
                    key: '_execUnitConvert',
                    value: function _execUnitConvert(type, from, to, value) {
                        var result = value;

                        from = from.toUpperCase();
                        to = to.toUpperCase();

                        switch (type) {
                            case 'temperature':
                                result = ConverterManager._convertTemperature(from, to, value);
                                break;
                            case 'length':
                                result = ConverterManager._convertLength(from, to, value);
                                break;
                            case 'weight':
                                result = ConverterManager._convertWeight(from, to, value);
                                break;
                            case 'volume':
                                result = ConverterManager._convertVolume(from, to, value);
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
                }, {
                    key: '_convertLength',
                    value: function _convertLength(from, to, value) {
                        var result = value;

                        switch (from + to) {
                            case 'MMI':
                                result = value * 0.00062137;
                                break;
                            case 'MYD':
                                result = value * 1.0936;
                                break;
                            case 'MFT':
                                result = value / 0.3048;
                                break;
                            case 'MIN':
                                result = value / 0.0254;
                                break;
                            case 'MIM':
                                result = value / 0.00062137;
                                break;
                            case 'MIYD':
                                result = value * 1760.0;
                                break;
                            case 'MIFT':
                                result = value * 5280.0;
                                break;
                            case 'MIIN':
                                result = value * 63360;
                                break;
                            case 'YDM':
                                result = value / 1.0936;
                                break;
                            case 'YDMI':
                                result = value * 0.00056818;
                                break;
                            case 'YDFT':
                                result = value * 3.0000;
                                break;
                            case 'YDIN':
                                result = value * 36.000;
                                break;
                            case 'FTM':
                                result = value / 3.2808399;
                                break;
                            case 'FTMI':
                                result = value * 0.00018939;
                                break;
                            case 'FTYD':
                                result = value * 0.33333;
                                break;
                            case 'FTIN':
                                result = value * 12;
                                break;
                            case 'INM':
                                result = value * 0.0254;
                                break;
                            case 'INMI':
                                result = value / 63.360;
                                break;
                            case 'INYD':
                                result = value * 0.027778;
                                break;
                            case 'INFT':
                                result = value / 12;
                                break;
                        }

                        return result;
                    }
                }, {
                    key: '_convertWeight',
                    value: function _convertWeight(from, to, value) {
                        var result = value;

                        switch (from + to) {
                            case 'KGLB':
                                result = value / 0.45359237;
                                break;
                            case 'KGOZ':
                                result = value / 0.02834952;
                                break;
                            case 'LBKG':
                                result = value * 0.45359237;
                                break;
                            case 'LBOZ':
                                result = value * 16;
                                break;
                            case 'OZKG':
                                result = value * 0.02834952;
                                break;
                            case 'OZLB':
                                result = value / 16;
                                break;
                        }

                        return result;
                    }
                }, {
                    key: '_convertVolume',
                    value: function _convertVolume(from, to, value) {
                        var result = value;

                        switch (from + to) {
                            case 'LGAL':
                                result = value * 0.26417;
                                break;
                            case 'LPT':
                                result = value / 2.113376;
                                break;
                            case 'GALL':
                                result = value / 0.26417;
                                break;
                            case 'GALPT':
                                result = value * 8;
                                break;
                            case 'PTL':
                                result = value / 1.7598;
                                break;
                            case 'PTGAL':
                                result = value / 8;
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
