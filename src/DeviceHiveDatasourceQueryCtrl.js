import './css/query-editor.css!';
import './DeviceHiveDirectives.js';
import { QueryCtrl } from 'app/plugins/sdk';


class DeviceHiveDatasourceQueryCtrl extends QueryCtrl {

    /**
     * Creates an instance of DeviceHiveDatasourceQueryCtrl.
     * @param {any} $scope
     * @param {any} $injector
     * @param {any} uiSegmentSrv
     * @memberof DeviceHiveDatasourceQueryCtrl
     */
    constructor($scope, $injector, uiSegmentSrv) {
        super($scope, $injector);

        const me = this;

        me.target.target = me.target.target || `select metric`;
        me.target.type = me.target.type || `command`;
        me.target.name = me.target.name || ``;
        me.target.dataPath = me.target.dataPath || ``;
        me.target.converters = me.target.converters || [];

        me.converterList = me.datasource.converterQuery();
        me.showHelp = false;
    }

    onAddConverter() {
        const me = this;

        me.target.converters.push(1);
    }

    /**
     * Refresh data every time query params change.
     *
     * @memberof DeviceHiveDatasourceQueryCtrl
     */
    onChangeInternal() {
        const me = this;

        me.panelCtrl.refresh();
    }
}

DeviceHiveDatasourceQueryCtrl.templateUrl = `partials/query.editor.html`;


export default DeviceHiveDatasourceQueryCtrl;