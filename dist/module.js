'use strict';

System.register(['./DeviceHiveDatasource', './DeviceHiveDatasourceQueryCtrl', './DeviceHiveAnnotationsQueryCtrl', './DeviceHiveConfigCtrl'], function (_export, _context) {
    "use strict";

    var DeviceHiveDatasource, DeviceHiveDatasourceQueryCtrl, DeviceHiveAnnotationsQueryCtrl, DeviceHiveConfigCtrl, DeviceHiveQueryOptionsCtrl;

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
        }, function (_DeviceHiveConfigCtrl) {
            DeviceHiveConfigCtrl = _DeviceHiveConfigCtrl.default;
        }],
        execute: function () {
            _export('QueryOptionsCtrl', DeviceHiveQueryOptionsCtrl = function DeviceHiveQueryOptionsCtrl() {
                _classCallCheck(this, DeviceHiveQueryOptionsCtrl);
            });

            DeviceHiveQueryOptionsCtrl.templateUrl = 'partials/query.options.html';

            _export('Datasource', DeviceHiveDatasource);

            _export('QueryCtrl', DeviceHiveDatasourceQueryCtrl);

            _export('ConfigCtrl', DeviceHiveConfigCtrl);

            _export('QueryOptionsCtrl', DeviceHiveQueryOptionsCtrl);

            _export('AnnotationsQueryCtrl', DeviceHiveAnnotationsQueryCtrl);
        }
    };
});
//# sourceMappingURL=module.js.map
