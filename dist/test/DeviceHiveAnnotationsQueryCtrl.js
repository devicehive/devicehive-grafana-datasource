"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * DeviceHive annotations QueryCtrl.
 * A JavaScript class that will be instantiated and treated as an Angular controller
 * when the user choose this type of datasource in the templating menu in the dashboard.
 */
var DeviceHiveAnnotationsQueryCtrl =

/**
 * Create new DeviceHiveAnnotationsQueryCtrl
 */
function DeviceHiveAnnotationsQueryCtrl() {
    _classCallCheck(this, DeviceHiveAnnotationsQueryCtrl);

    this.showHelp = false;
    this.annotation.config = this.annotation.config || {
        type: "command",
        name: "",
        dataPath: ""
    };
};

DeviceHiveAnnotationsQueryCtrl.templateUrl = "partials/annotations.editor.html";

exports.default = DeviceHiveAnnotationsQueryCtrl;
//# sourceMappingURL=DeviceHiveAnnotationsQueryCtrl.js.map
