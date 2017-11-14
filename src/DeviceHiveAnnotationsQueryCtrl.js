
/**
 * DeviceHive annotations QueryCtrl.
 * A JavaScript class that will be instantiated and treated as an Angular controller
 * when the user choose this type of datasource in the templating menu in the dashboard.
 */
class DeviceHiveAnnotationsQueryCtrl {

    /**
     * Create new DeviceHiveAnnotationsQueryCtrl
     */
    constructor() {
        this.showHelp = false;
        this.annotation.config = this.annotation.config || {
            type: `command`,
            name: ``,
            dataPath: ``
        };
    }
}

DeviceHiveAnnotationsQueryCtrl.templateUrl = `partials/annotations.editor.html`;

export default DeviceHiveAnnotationsQueryCtrl;