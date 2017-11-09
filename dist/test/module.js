'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnnotationsQueryCtrl = exports.ConfigCtrl = exports.QueryCtrl = exports.Datasource = undefined;

var _DeviceHiveDatasource = require('./DeviceHiveDatasource');

var _DeviceHiveDatasource2 = _interopRequireDefault(_DeviceHiveDatasource);

var _DeviceHiveDatasourceQueryCtrl = require('./DeviceHiveDatasourceQueryCtrl');

var _DeviceHiveDatasourceQueryCtrl2 = _interopRequireDefault(_DeviceHiveDatasourceQueryCtrl);

var _DeviceHiveAnnotationsQueryCtrl = require('./DeviceHiveAnnotationsQueryCtrl');

var _DeviceHiveAnnotationsQueryCtrl2 = _interopRequireDefault(_DeviceHiveAnnotationsQueryCtrl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DeviceHiveConfigCtrl = function DeviceHiveConfigCtrl() {
  _classCallCheck(this, DeviceHiveConfigCtrl);
};

DeviceHiveConfigCtrl.templateUrl = 'partials/datasource.config.html';

exports.Datasource = _DeviceHiveDatasource2.default;
exports.QueryCtrl = _DeviceHiveDatasourceQueryCtrl2.default;
exports.ConfigCtrl = DeviceHiveConfigCtrl;
exports.AnnotationsQueryCtrl = _DeviceHiveAnnotationsQueryCtrl2.default;
//# sourceMappingURL=module.js.map
