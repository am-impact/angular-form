angular.module('global.directives', [])

.directive('formRow', function () {
	return {
		restrict: 'EA',
		templateUrl: FW.Config.submap + 'angular/directives/formRow',
		replace: true,
		scope: {
			record: '=',
			recordname: '@',
			type: '@',
			field: '@',
			label: '@',
			nameprefix: '@',
			options: '=',
			sublabel: '@',
			required: '@',
			getSchoolByBrinNummer: '&',
			getLeerlingByBsnNummer: '&',
			dtopen: '='
		},
		link: function($scope, $rootScope, element, attr) {
			// Wordt gezet bij form submit
			$scope.$on('record:invalid', function() {
				console.log( $scope.field );

				if( $scope[$scope.field][$scope.field] ) {
					$scope[$scope.field][$scope.field].$setDirty();
				}
			});

			/**
			 * No match (bijv: password nog een keer invoeren)
			 */
			$scope.$on('record:nomatch', function(self,field) {
				if( field === $scope.field ) {
					$scope[$scope.field][$scope.field].$setValidity("nomatch", false);
				}
			});

			/**
			 * Match (bijv: password matcht)
			 */
			$scope.$on('record:match', function(self,field) {
				if( field === $scope.field ) {
					$scope[$scope.field][$scope.field].$setValidity("nomatch", true);
				}
			});

			/**
			 * Date field
			 */
			$scope.openDatepicker = $scope.$root.openDatepicker;
		}
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
}])


/**
 * Datepicker clean date format
 */
.directive('datepickerPopup', function (){
    return {
        restrict: 'EAC',
        require: 'ngModel',
        link: function(scope, element, attr, controller) {
      		controller.$formatters.shift();
  		}
	}
})


/**
 * Enter key event
 */
.directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if(event.which === 13) {
                scope.$apply(function(){
                        scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});