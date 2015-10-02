angular.module('global.directives', [])

.directive('formRow', function () {
	return {
		restrict: 'EA',
		templateUrl: FW.Config.submap + 'angular/directives/formRow',
		replace: false,
		scope: {
			record: '=',
			recordname: '@',
			type: '@',
			field: '@',
			nameprefix: '@',
			label: '@',
			options: '=',
			sublabel: '@',
			required: '@',
			maxfilesize: '@',
			filetypes: '@',
			multiple: '@'
		},
		link: function($scope, element, attr) {
			// Wordt gezet bij form submit
			$scope.$on('record:invalid', function() {
				if( $scope[$scope.field][$scope.field] ) {
					$scope[$scope.field][$scope.field].$setDirty();
				}
			});

			$scope.defaultFileTypes = 'image/*,application/pdf,application/msword';
			$scope.defaultFileSize = '5MB'
		}
	}
})

.directive('formSteps', function() {
    return {
        restrict: 'E',
        templateUrl: FW.Config.submap + 'angular/directives/steps'
    }
})

/**
 * Check of een input type file gevuld is, kan niet standaard met required
 */
.directive('validFile', function () {
    return {
        require: 'ngModel',
        link: function ($scope, el, attrs, ngModel) {
            // afterChange paramater, omdat $render bij laden ook al wordt aangeroepen
            ngModel.$render = function ( afterChange ) {
                if( afterChange ) {
                	ngModel.$setViewValue( el.val() );
                }
            };

            el.bind('change', function () {
                $scope.$apply(function () {
                    ngModel.$render( true );
                });
            });
        }
    };
})

/**
 * Gebruikt bij input[type=file]
 */
.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
