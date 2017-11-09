import DeviceHiveDatasource from './DeviceHiveDatasource';
import DeviceHiveDatasourceQueryCtrl from './DeviceHiveDatasourceQueryCtrl';
import DeviceHiveAnnotationsQueryCtrl from './DeviceHiveAnnotationsQueryCtrl';

class DeviceHiveConfigCtrl {}
DeviceHiveConfigCtrl.templateUrl = `partials/datasource.config.html`;

export {
  DeviceHiveDatasource as Datasource,
  DeviceHiveDatasourceQueryCtrl as QueryCtrl,
  DeviceHiveConfigCtrl as ConfigCtrl,
  DeviceHiveAnnotationsQueryCtrl as AnnotationsQueryCtrl
};
