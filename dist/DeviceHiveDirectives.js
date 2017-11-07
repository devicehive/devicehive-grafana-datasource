'use strict';

System.register(['angular'], function (_export, _context) {
    "use strict";

    var angular, _createClass, templatesRoot, AddButton, ConverterSelector;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [function (_angular) {
            angular = _angular.default;
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

            templatesRoot = 'public/plugins/devicehive-devicehive-datasource/partials';

            AddButton = function AddButton() {
                _classCallCheck(this, AddButton);

                this.restrict = 'E';
                this.templateUrl = templatesRoot + '/add.button.html';
            };

            ConverterSelector = function () {
                function ConverterSelector() {
                    _classCallCheck(this, ConverterSelector);

                    this.restrict = 'E';
                    this.templateUrl = templatesRoot + '/converter.selector.html';
                    this.scope = {
                        options: '='
                    };
                }

                _createClass(ConverterSelector, [{
                    key: 'controller',
                    value: function controller($scope) {
                        $scope.isConverterSelected = false;
                        $scope.options = $scope.options || [];
                        $scope.selectedConverter = $scope.selectedConverter || [];

                        $scope.onConverterSelect = function () {
                            $scope.isConverterSelected = true;
                        };
                    }
                }]);

                return ConverterSelector;
            }();

            angular.module('grafana.directives').directive('addButton', function () {
                return new AddButton();
            }).directive('converterSelector', function () {
                return new ConverterSelector();
            });
        }
    };
});
//# sourceMappingURL=DeviceHiveDirectives.js.map
