import angular from 'angular';
import ConverterManager from './ConverterManager.js';

const converterManager = new ConverterManager();
const templatesRoot = `public/plugins/devicehive-devicehive-datasource/partials`;


class ConverterSelector {

    constructor() {
        const me = this;

        me.restrict = 'E';
        me.templateUrl = `${templatesRoot}/converter.selector.html`;
        me.scope = {
            onlySelector: '@',
            onSelect: `&`,
            onBlur: `&`
        }
    }

    link (scope, element, attrs) {
        scope.expanded = false;
        scope.selectedConverter = null;
        scope.converters = converterManager.getConvertersNameList();

        scope.onChange = () => {
            scope.onSelect({ converterName: scope.selectedConverter });
            scope.toggleSelector();
        };

        scope.toggleSelector = () => {
            scope.expanded = !scope.expanded;
            scope.selectedConverter = null;
        };
    }
}


class Converter {

    constructor() {
        const me = this;

        me.restrict = 'E';
        me.templateUrl = `${templatesRoot}/converter.html`;
        me.scope = {
            converterName: '=',
            argValues: '=',
            onDelete: '&'
        }
    }

    link (scope, element, attrs) {
        scope.isConverterSelected = true;
        scope.showEditPanel = false;
        scope.config = converterManager.getConverterObject(scope.converterName);

        scope.toggleEditPanel = () => {
            scope.showEditPanel = !scope.showEditPanel;
        };

        scope.changeConverter = () => {
            scope.isConverterSelected = false;
        };

        scope.onConverterSelect = (converterName) => {
            scope.config = converterManager.getConverterObject(converterName);
            scope.isConverterSelected = true;
        };
    }
}

angular
    .module('grafana.directives')
    .directive('converterSelector', () => new ConverterSelector)
    .directive('converter', () => new Converter);