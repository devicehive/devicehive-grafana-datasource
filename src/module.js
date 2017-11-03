import GenericDatasource from './GenericDatasource';
import GenericDatasourceQueryCtrl from './GenericDatasourceQueryCtrl';

class GenericConfigCtrl {}
GenericConfigCtrl.templateUrl = `partials/config.html`;

class GenericQueryOptionsCtrl {}
GenericQueryOptionsCtrl.templateUrl = `partials/query.options.html`;

class GenericAnnotationsQueryCtrl {}
GenericAnnotationsQueryCtrl.templateUrl = `partials/annotations.editor.html`;

export {
  GenericDatasource as Datasource,
  GenericDatasourceQueryCtrl as QueryCtrl,
  GenericConfigCtrl as ConfigCtrl,
  GenericQueryOptionsCtrl as QueryOptionsCtrl,
  GenericAnnotationsQueryCtrl as AnnotationsQueryCtrl
};
