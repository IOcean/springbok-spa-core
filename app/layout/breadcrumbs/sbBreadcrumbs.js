(function () {
    'use strict';
    
    var TEMPLATE = '<ul class="breadcrumb"> ' +
                        '<li ng-repeat="breadcrumb in $ctrl.breadcrumbs"> ' +
                            '<a ng-if="breadcrumb.url" ' +
                               'ng-href="#{{breadcrumb.url}}"> ' +
                                '{{breadcrumb.key | translate}} ' +
                            '</a> ' +
                            '<span ng-if="!breadcrumb.url"> ' +
                                '{{breadcrumb.key | translate}} ' +
                            '</span> ' +
                        '</li> ' +
                    '</ul>';
    
    function sbBreadcrumbsController() {
        this.breadcrumbs = this.breadcrumbs ? this.breadcrumbs : [];
    }
    
    angular.module('springbok.core').component('sbBreadcrumbs', {
        template: TEMPLATE,
        controller: sbBreadcrumbsController,
        bindings : {
            breadcrumbs: '='
        }
    });
})();

