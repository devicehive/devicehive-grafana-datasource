
/**
 *
 */
class GenericAnnotationsQueryCtrl {
    constructor() {
        this.annotation.type = this.annotation.type || `command`;
        this.annotation.entityName = this.annotation.entityName || ``;
        this.annotation.dataPath = this.annotation.dataPath || ``;
    }
}

GenericAnnotationsQueryCtrl.templateUrl = `partials/annotations.editor.html`;

export default GenericAnnotationsQueryCtrl;