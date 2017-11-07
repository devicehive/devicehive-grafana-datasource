"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *
 */
var GenericAnnotationsQueryCtrl = function GenericAnnotationsQueryCtrl() {
    _classCallCheck(this, GenericAnnotationsQueryCtrl);

    this.annotation.type = this.annotation.type || "command";
    this.annotation.entityName = this.annotation.entityName || "";
    this.annotation.dataPath = this.annotation.dataPath || "";
};

GenericAnnotationsQueryCtrl.templateUrl = "partials/annotations.editor.html";

exports.default = GenericAnnotationsQueryCtrl;
//# sourceMappingURL=GenericAnnotationsQueryCtrl.js.map
