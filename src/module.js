import DeviceHiveDatasource from './DeviceHiveDatasource';
import DeviceHiveDatasourceQueryCtrl from './DeviceHiveDatasourceQueryCtrl';
import DeviceHiveAnnotationsQueryCtrl from './DeviceHiveAnnotationsQueryCtrl';
import DeviceHiveConfigCtrl from './DeviceHiveConfigCtrl';

class DeviceHiveQueryOptionsCtrl {}
DeviceHiveQueryOptionsCtrl.templateUrl = `partials/query.options.html`;

export {
    DeviceHiveDatasource as Datasource,
    DeviceHiveDatasourceQueryCtrl as QueryCtrl,
    DeviceHiveConfigCtrl as ConfigCtrl,
    DeviceHiveQueryOptionsCtrl as QueryOptionsCtrl,
    DeviceHiveAnnotationsQueryCtrl as AnnotationsQueryCtrl
};
