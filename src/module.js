import GenericDatasource from './GenericDatasource';
import GenericDatasourceQueryCtrl from './GenericDatasourceQueryCtrl';
import GenericAnnotationsQueryCtrl from './GenericAnnotationsQueryCtrl';

class GenericConfigCtrl {}
GenericConfigCtrl.templateUrl = `partials/config.html`;

class GenericQueryOptionsCtrl {}
GenericQueryOptionsCtrl.templateUrl = `partials/query.options.html`;


export {
  GenericDatasource as Datasource,
  GenericDatasourceQueryCtrl as QueryCtrl,
  GenericConfigCtrl as ConfigCtrl,
  GenericQueryOptionsCtrl as QueryOptionsCtrl,
  GenericAnnotationsQueryCtrl as AnnotationsQueryCtrl
};
