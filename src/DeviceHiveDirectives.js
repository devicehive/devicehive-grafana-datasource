import angular from 'angular';

const templatesRoot = `public/plugins/devicehive-devicehive-datasource/partials`;

class AddButton {

    constructor() {
        this.restrict = 'E';
        this.templateUrl = `${templatesRoot}/add.button.html`;
    }
}

class ConverterSelector {

    constructor() {
        this.restrict = 'E';
        this.templateUrl = `${templatesRoot}/converter.selector.html`;
        this.scope = {
            options: '='
        }
    }

    controller($scope) {
        $scope.isConverterSelected = false;
        $scope.options = $scope.options || [];
        $scope.selectedConverter = $scope.selectedConverter || [];

        $scope.onConverterSelect = () => {
            $scope.isConverterSelected = true;
        }
    }
}

angular
    .module('grafana.directives')
    .directive('addButton', () => new AddButton)
    .directive('converterSelector', () => new ConverterSelector);