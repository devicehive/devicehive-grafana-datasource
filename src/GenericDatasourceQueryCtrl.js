import './css/query-editor.css!'
import { QueryCtrl } from 'app/plugins/sdk';

class GenericDatasourceQueryCtrl extends QueryCtrl {

  /**
   * Creates an instance of GenericDatasourceQueryCtrl.
   * @param {any} $scope 
   * @param {any} $injector 
   * @param {any} uiSegmentSrv 
   * @memberof GenericDatasourceQueryCtrl
   */
  constructor($scope, $injector, uiSegmentSrv){
    super($scope, $injector);

    this.target.target = this.target.target || `select metric`;
    this.target.type = this.target.type || `command`;
    this.target.name = this.target.name || ``;
    this.target.dataPath = this.target.dataPath || ``;
    this.target.scale = this.target.scale || 1;
    this.target.showHelp = false;
  }

  /**
   * Refresh data every time query params change.
   * 
   * @memberof GenericDatasourceQueryCtrl
   */
  onChangeInternal() {
    this.panelCtrl.refresh();
  }
}

GenericDatasourceQueryCtrl.templateUrl = `partials/query.editor.html`;


export default GenericDatasourceQueryCtrl;