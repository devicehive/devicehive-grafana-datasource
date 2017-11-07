import DeviceHiveDatasource from './DeviceHiveDatasource';
import DeviceHiveDatasourceQueryCtrl from './DeviceHiveDatasourceQueryCtrl';
import DeviceHiveAnnotationsQueryCtrl from './DeviceHiveAnnotationsQueryCtrl';
import DeviceHiveQueryOptionsCtrl from './DeviceHiveQueryOptionsCtrl';

class DeviceHiveConfigCtrl {}
DeviceHiveConfigCtrl.templateUrl = `partials/config.html`;

export {
  DeviceHiveDatasource as Datasource,
  DeviceHiveDatasourceQueryCtrl as QueryCtrl,
  DeviceHiveConfigCtrl as ConfigCtrl,
  DeviceHiveQueryOptionsCtrl as QueryOptionsCtrl,
  DeviceHiveAnnotationsQueryCtrl as AnnotationsQueryCtrl
};
