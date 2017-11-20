'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('./css/query-editor.css!');

require('./DeviceHiveDirectives.js');

var _sdk = require('app/plugins/sdk');

var _ConverterManager = require('./ConverterManager.js');

var _ConverterManager2 = _interopRequireDefault(_ConverterManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var converterManager = new _ConverterManager2.default();

/**
 * DeviceHive datasource QueryCtrl.
 * A JavaScript class that will be instantiated and treated as an Angular controller
 * when the user edits metrics in a panel. This class has to inherit from the app/plugins/sdk.QueryCtrl class.
 */

var DeviceHiveDatasourceQueryCtrl = function (_QueryCtrl) {
    _inherits(DeviceHiveDatasourceQueryCtrl, _QueryCtrl);

    /**
     * Creates an instance of DeviceHiveDatasourceQueryCtrl.
     * @param {any} $scope
     * @param {any} $injector
     * @param {any} uiSegmentSrv
     * @memberof DeviceHiveDatasourceQueryCtrl
     */
    function DeviceHiveDatasourceQueryCtrl($scope, $injector, uiSegmentSrv) {
        _classCallCheck(this, DeviceHiveDatasourceQueryCtrl);

        var _this = _possibleConstructorReturn(this, (DeviceHiveDatasourceQueryCtrl.__proto__ || Object.getPrototypeOf(DeviceHiveDatasourceQueryCtrl)).call(this, $scope, $injector));

        var me = _this;

        me.target.target = me.target.target || 'select metric';
        me.target.type = me.target.type || 'notification';
        me.target.target = me.target.label || '' + me.target.type + me.target.refId;
        me.target.name = me.target.name || '';
        me.target.dataPath = me.target.dataPath || '';
        me.target.converters = me.target.converters || [];

        me.showHelp = false;
        return _this;
    }

    /**
     * Add converter handler
     * @param converterName
     */


    _createClass(DeviceHiveDatasourceQueryCtrl, [{
        key: 'onAddConverter',
        value: function onAddConverter(converterName) {
            var me = this;

            me.target.converters.push({
                name: converterName,
                argValues: converterManager.getConverterDefaultValuesObject(converterName)
            });
        }

        /**
         * Delete converter handler
         * @param index
         */

    }, {
        key: 'onDeleteConverter',
        value: function onDeleteConverter(index) {
            var me = this;

            me.target.converters.splice(index, 1);
        }

        /**
         * Refresh data every time query params change.
         * @memberof DeviceHiveDatasourceQueryCtrl
         */

    }, {
        key: 'onChangeInternal',
        value: function onChangeInternal() {
            var me = this;

            me.panelCtrl.refresh();
        }
    }]);

    return DeviceHiveDatasourceQueryCtrl;
}(_sdk.QueryCtrl);

DeviceHiveDatasourceQueryCtrl.templateUrl = 'partials/query.editor.html';

exports.default = DeviceHiveDatasourceQueryCtrl;
//# sourceMappingURL=DeviceHiveDatasourceQueryCtrl.js.map
