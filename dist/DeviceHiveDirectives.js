'use strict';

System.register(['angular', './ConverterManager.js'], function (_export, _context) {
    "use strict";

    var angular, ConverterManager, _createClass, converterManager, templatesRoot, ConverterSelector, Converter;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [function (_angular) {
            angular = _angular.default;
        }, function (_ConverterManagerJs) {
            ConverterManager = _ConverterManagerJs.default;
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

            converterManager = new ConverterManager();
            templatesRoot = 'public/plugins/devicehive-devicehive-datasource/partials';

            ConverterSelector = function () {
                function ConverterSelector() {
                    _classCallCheck(this, ConverterSelector);

                    var me = this;

                    me.restrict = 'E';
                    me.templateUrl = templatesRoot + '/converter.selector.html';
                    me.scope = {
                        onlySelector: '@',
                        onSelect: '&',
                        onBlur: '&'
                    };
                }

                _createClass(ConverterSelector, [{
                    key: 'link',
                    value: function link(scope, element, attrs) {
                        scope.expanded = false;
                        scope.selectedConverter = null;
                        scope.converters = converterManager.getConvertersNameList();

                        scope.onChange = function () {
                            scope.onSelect({ converterName: scope.selectedConverter });
                            scope.toggleSelector();
                        };

                        scope.toggleSelector = function () {
                            scope.expanded = !scope.expanded;
                            scope.selectedConverter = null;
                        };
                    }
                }]);

                return ConverterSelector;
            }();

            Converter = function () {
                function Converter() {
                    _classCallCheck(this, Converter);

                    var me = this;

                    me.restrict = 'E';
                    me.templateUrl = templatesRoot + '/converter.html';
                    me.scope = {
                        converterName: '=',
                        argValues: '=',
                        onDelete: '&'
                    };
                }

                _createClass(Converter, [{
                    key: 'link',
                    value: function link(scope, element, attrs) {
                        scope.isConverterSelected = true;
                        scope.showEditPanel = false;
                        scope.config = converterManager.getConverterObject(scope.converterName);

                        scope.toggleEditPanel = function () {
                            scope.showEditPanel = !scope.showEditPanel;
                        };

                        scope.changeConverter = function () {
                            scope.isConverterSelected = false;
                        };

                        scope.onConverterSelect = function (converterName) {
                            if (scope.converterName !== converterName) {
                                scope.converterName = converterName;
                                scope.config = converterManager.getConverterObject(converterName);
                                scope.argValues = converterManager.getConverterDefaultValuesObject(converterName);
                            }

                            scope.isConverterSelected = true;
                        };

                        scope.onTypeChange = function () {
                            var optionValue = ConverterManager.getUnitConvertOptions()[scope.argValues[0]][0];

                            Object.keys(scope.argValues).forEach(function (key, index) {
                                scope.argValues[key] = index === 0 ? scope.argValues[key] : optionValue;
                            });
                        };
                    }
                }]);

                return Converter;
            }();

            angular.module('grafana.directives').directive('dhConverterSelector', function () {
                return new ConverterSelector();
            }).directive('dhConverter', function () {
                return new Converter();
            });
        }
    };
});
//# sourceMappingURL=DeviceHiveDirectives.js.map
