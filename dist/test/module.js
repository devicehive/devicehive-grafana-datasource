'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnnotationsQueryCtrl = exports.QueryOptionsCtrl = exports.ConfigCtrl = exports.QueryCtrl = exports.Datasource = undefined;

var _GenericDatasource = require('./GenericDatasource');

var _GenericDatasource2 = _interopRequireDefault(_GenericDatasource);

var _GenericDatasourceQueryCtrl = require('./GenericDatasourceQueryCtrl');

var _GenericDatasourceQueryCtrl2 = _interopRequireDefault(_GenericDatasourceQueryCtrl);

var _GenericAnnotationsQueryCtrl = require('./GenericAnnotationsQueryCtrl');

var _GenericAnnotationsQueryCtrl2 = _interopRequireDefault(_GenericAnnotationsQueryCtrl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GenericConfigCtrl = function GenericConfigCtrl() {
  _classCallCheck(this, GenericConfigCtrl);
};

GenericConfigCtrl.templateUrl = 'partials/config.html';

var GenericQueryOptionsCtrl = function GenericQueryOptionsCtrl() {
  _classCallCheck(this, GenericQueryOptionsCtrl);
};

GenericQueryOptionsCtrl.templateUrl = 'partials/query.options.html';

exports.Datasource = _GenericDatasource2.default;
exports.QueryCtrl = _GenericDatasourceQueryCtrl2.default;
exports.ConfigCtrl = GenericConfigCtrl;
exports.QueryOptionsCtrl = GenericQueryOptionsCtrl;
exports.AnnotationsQueryCtrl = _GenericAnnotationsQueryCtrl2.default;
//# sourceMappingURL=module.js.map
