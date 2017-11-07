"use strict";

System.register([], function (_export, _context) {
    "use strict";

    var GenericAnnotationsQueryCtrl;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [],
        execute: function () {
            GenericAnnotationsQueryCtrl = function GenericAnnotationsQueryCtrl() {
                _classCallCheck(this, GenericAnnotationsQueryCtrl);

                this.annotation.type = this.annotation.type || "command";
                this.annotation.entityName = this.annotation.entityName || "";
                this.annotation.dataPath = this.annotation.dataPath || "";
            };

            GenericAnnotationsQueryCtrl.templateUrl = "partials/annotations.editor.html";

            _export("default", GenericAnnotationsQueryCtrl);
        }
    };
});
//# sourceMappingURL=GenericAnnotationsQueryCtrl.js.map
