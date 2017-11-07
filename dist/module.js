'use strict';

System.register(['./GenericDatasource', './GenericDatasourceQueryCtrl', './GenericAnnotationsQueryCtrl'], function (_export, _context) {
  "use strict";

  var GenericDatasource, GenericDatasourceQueryCtrl, GenericAnnotationsQueryCtrl, GenericConfigCtrl, GenericQueryOptionsCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_GenericDatasource) {
      GenericDatasource = _GenericDatasource.default;
    }, function (_GenericDatasourceQueryCtrl) {
      GenericDatasourceQueryCtrl = _GenericDatasourceQueryCtrl.default;
    }, function (_GenericAnnotationsQueryCtrl) {
      GenericAnnotationsQueryCtrl = _GenericAnnotationsQueryCtrl.default;
    }],
    execute: function () {
      _export('ConfigCtrl', GenericConfigCtrl = function GenericConfigCtrl() {
        _classCallCheck(this, GenericConfigCtrl);
      });

      GenericConfigCtrl.templateUrl = 'partials/config.html';

      _export('QueryOptionsCtrl', GenericQueryOptionsCtrl = function GenericQueryOptionsCtrl() {
        _classCallCheck(this, GenericQueryOptionsCtrl);
      });

      GenericQueryOptionsCtrl.templateUrl = 'partials/query.options.html';

      _export('Datasource', GenericDatasource);

      _export('QueryCtrl', GenericDatasourceQueryCtrl);

      _export('ConfigCtrl', GenericConfigCtrl);

      _export('QueryOptionsCtrl', GenericQueryOptionsCtrl);

      _export('AnnotationsQueryCtrl', GenericAnnotationsQueryCtrl);
    }
  };
});
//# sourceMappingURL=module.js.map
