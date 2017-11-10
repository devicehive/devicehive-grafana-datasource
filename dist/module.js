'use strict';

System.register(['./DeviceHiveDatasource', './DeviceHiveDatasourceQueryCtrl', './DeviceHiveAnnotationsQueryCtrl', './DeviceHiveConfigCtrl'], function (_export, _context) {
    "use strict";

    var DeviceHiveDatasource, DeviceHiveDatasourceQueryCtrl, DeviceHiveAnnotationsQueryCtrl, DeviceHiveConfigCtrl;
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
            _export('Datasource', DeviceHiveDatasource);

            _export('QueryCtrl', DeviceHiveDatasourceQueryCtrl);

            _export('ConfigCtrl', DeviceHiveConfigCtrl);

            _export('AnnotationsQueryCtrl', DeviceHiveAnnotationsQueryCtrl);
        }
    };
});
//# sourceMappingURL=module.js.map
