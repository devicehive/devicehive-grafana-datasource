
/**
 *
 */
class DeviceHiveAnnotationsQueryCtrl {

    /**
     *
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