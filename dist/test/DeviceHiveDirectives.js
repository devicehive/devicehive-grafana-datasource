'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var templatesRoot = 'public/plugins/devicehive-devicehive-datasource/partials';

var AddButton = function AddButton() {
    _classCallCheck(this, AddButton);

    this.restrict = 'E';
    this.templateUrl = templatesRoot + '/add.button.html';
};

var ConverterSelector = function () {
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

_angular2.default.module('grafana.directives').directive('addButton', function () {
    return new AddButton();
}).directive('converterSelector', function () {
    return new ConverterSelector();
});
//# sourceMappingURL=DeviceHiveDirectives.js.map
