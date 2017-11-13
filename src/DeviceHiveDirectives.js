import angular from 'angular';
import ConverterManager from './ConverterManager.js';

const converterManager = new ConverterManager();
const templatesRoot = `public/plugins/devicehive-devicehive-datasource/partials`;


/**
 * ConverterSelector angular directive class
 */
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


/**
 * Converter angular directive class
 */
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
            if (scope.converterName !== converterName) {
                scope.converterName = converterName;
                scope.config = converterManager.getConverterObject(converterName);
                scope.argValues = converterManager.getConverterDefaultValuesObject(converterName);
            }

            scope.isConverterSelected = true;
        };

        scope.onTypeChange = function () {
            const optionValue = ConverterManager.getUnitConvertOptions()[scope.argValues[0]][0];

            Object.keys(scope.argValues).forEach(function(key, index) {
                scope.argValues[key] = index === 0 ? scope.argValues[key] : optionValue
            });
        }
    }
}

angular
    .module('grafana.directives')
    .directive('dhConverterSelector', () => new ConverterSelector)
    .directive('dhConverter', () => new Converter);