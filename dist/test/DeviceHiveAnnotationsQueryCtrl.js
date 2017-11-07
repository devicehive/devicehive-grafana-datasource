"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *
 */
var DeviceHiveAnnotationsQueryCtrl =

/**
 *
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
