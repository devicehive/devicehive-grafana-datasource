import './css/query-editor.css!';
import './DeviceHiveDirectives.js';
import { QueryCtrl } from 'app/plugins/sdk';
import ConverterManager from './ConverterManager.js';

const converterManager = new ConverterManager();


/**
 * DeviceHive datasource QueryCtrl.
 * A JavaScript class that will be instantiated and treated as an Angular controller
 * when the user edits metrics in a panel. This class has to inherit from the app/plugins/sdk.QueryCtrl class.
 */
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
        me.target.type = me.target.type || `notification`;
        me.target.target = me.target.label || `${me.target.type}${me.target.refId}`;
        me.target.name = me.target.name || ``;
        me.target.dataPath = me.target.dataPath || ``;
        me.target.converters = me.target.converters || [];

        me.showHelp = false;
    }

    /**
     * Add converter handler
     * @param converterName
     */
    onAddConverter(converterName) {
        const me = this;

        me.target.converters.push({
            name: converterName,
            argValues: converterManager.getConverterDefaultValuesObject(converterName)
        });
    }

    /**
     * Delete converter handler
     * @param index
     */
    onDeleteConverter(index) {
        const me = this;

        me.target.converters.splice(index, 1);
    }

    /**
     * Refresh data every time query params change.
     * @memberof DeviceHiveDatasourceQueryCtrl
     */
    onChangeInternal() {
        const me = this;

        me.panelCtrl.refresh();
    }
}

DeviceHiveDatasourceQueryCtrl.templateUrl = `partials/query.editor.html`;


export default DeviceHiveDatasourceQueryCtrl;