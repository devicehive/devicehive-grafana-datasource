'use strict';

System.register(['./css/query-editor.css!', 'app/plugins/sdk'], function (_export, _context) {
  "use strict";

  var QueryCtrl, _createClass, GenericDatasourceQueryCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  return {
    setters: [function (_cssQueryEditorCss) {}, function (_appPluginsSdk) {
      QueryCtrl = _appPluginsSdk.QueryCtrl;
    }],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      _export('GenericDatasourceQueryCtrl', GenericDatasourceQueryCtrl = function (_QueryCtrl) {
        _inherits(GenericDatasourceQueryCtrl, _QueryCtrl);

        /**
         * Creates an instance of GenericDatasourceQueryCtrl.
         * @param {any} $scope 
         * @param {any} $injector 
         * @param {any} uiSegmentSrv 
         * @memberof GenericDatasourceQueryCtrl
         */
        function GenericDatasourceQueryCtrl($scope, $injector, uiSegmentSrv) {
          _classCallCheck(this, GenericDatasourceQueryCtrl);

          var _this = _possibleConstructorReturn(this, (GenericDatasourceQueryCtrl.__proto__ || Object.getPrototypeOf(GenericDatasourceQueryCtrl)).call(this, $scope, $injector));

          _this.scope = $scope;
          _this.uiSegmentSrv = uiSegmentSrv;
          _this.target.target = _this.target.target || 'select metric';
          _this.target.type = _this.target.type || 'command';
          _this.target.dataPath = _this.target.dataPath || '';
          _this.target.scale = _this.target.scale || 1;
          return _this;
        }

        /**
         * Refresh data every time query params change.
         * 
         * @memberof GenericDatasourceQueryCtrl
         */


        _createClass(GenericDatasourceQueryCtrl, [{
          key: 'onChangeInternal',
          value: function onChangeInternal() {
            this.panelCtrl.refresh();
          }
        }]);

        return GenericDatasourceQueryCtrl;
      }(QueryCtrl));

      _export('GenericDatasourceQueryCtrl', GenericDatasourceQueryCtrl);

      GenericDatasourceQueryCtrl.templateUrl = 'partials/query.editor.html';
    }
  };
});
//# sourceMappingURL=query_ctrl.js.map
