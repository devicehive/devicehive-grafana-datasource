'use strict';

System.register(['./DeviceHiveDatasource', './DeviceHiveDatasourceQueryCtrl', './DeviceHiveAnnotationsQueryCtrl', './DeviceHiveQueryOptionsCtrl'], function (_export, _context) {
  "use strict";

  var DeviceHiveDatasource, DeviceHiveDatasourceQueryCtrl, DeviceHiveAnnotationsQueryCtrl, DeviceHiveQueryOptionsCtrl, DeviceHiveConfigCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_DeviceHiveDatasource) {
      DeviceHiveDatasource = _DeviceHiveDatasource.default;
    }, function (_DeviceHiveDatasourceQueryCtrl) {
      DeviceHiveDatasourceQueryCtrl = _DeviceHiveDatasourceQueryCtrl.default;
    }, function (_DeviceHiveAnnotationsQueryCtrl) {
      DeviceHiveAnnotationsQueryCtrl = _DeviceHiveAnnotationsQueryCtrl.default;
    }, function (_DeviceHiveQueryOptionsCtrl) {
      DeviceHiveQueryOptionsCtrl = _DeviceHiveQueryOptionsCtrl.default;
    }],
    execute: function () {
      _export('ConfigCtrl', DeviceHiveConfigCtrl = function DeviceHiveConfigCtrl() {
        _classCallCheck(this, DeviceHiveConfigCtrl);
      });

      DeviceHiveConfigCtrl.templateUrl = 'partials/config.html';

      _export('Datasource', DeviceHiveDatasource);

      _export('QueryCtrl', DeviceHiveDatasourceQueryCtrl);

      _export('ConfigCtrl', DeviceHiveConfigCtrl);

      _export('QueryOptionsCtrl', DeviceHiveQueryOptionsCtrl);

      _export('AnnotationsQueryCtrl', DeviceHiveAnnotationsQueryCtrl);
    }
  };
});
//# sourceMappingURL=module.js.map
