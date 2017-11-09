"use strict";

System.register([], function (_export, _context) {
    "use strict";

    var DeviceHiveAnnotationsQueryCtrl;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [],
        execute: function () {
            DeviceHiveAnnotationsQueryCtrl =

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

            _export("default", DeviceHiveAnnotationsQueryCtrl);
        }
    };
});
//# sourceMappingURL=DeviceHiveAnnotationsQueryCtrl.js.map
