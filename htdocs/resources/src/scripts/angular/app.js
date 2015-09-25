angular.module('formApp', [
	'ui.router',
	'ngAnimate',
	'ngMessages',
	'ngFileUpload',
    'gobal'
])

.config(function($stateProvider, $interpolateProvider, $urlRouterProvider) {
	// Change delimeters
	$interpolateProvider.startSymbol('[[');
	$interpolateProvider.endSymbol(']]');

    $stateProvider
        // route to show our basic form (/form)
        .state('form', {
            url: '/form',
            templateUrl: FW.Config.submap + 'angular/form.twig',
            controller: 'FormCtrl'
        })

        // url will be /form/step1
        .state('form.step1', {
            url: '/step1',
            templateUrl: FW.Config.submap + 'angular/step1.twig'
        })

        // url will be /form/step1
        .state('form.step2', {
            url: '/step2',
            templateUrl:  FW.Config.submap + 'angular/step2.twig'
        })
        // url will be /form/step3
        .state('form.step3', {
            url: '/step3',
            templateUrl: FW.Config.submap + 'angular/step3.twig'
        });

    // send users to the form page
    $urlRouterProvider.otherwise('/form');
})

.controller('FormCtrl', function($scope) {

    // we will store all of our form data in this object
    $scope.formData = {};

    // function to process the form
    $scope.processForm = function() {
        alert('awesome!');
    };

});



// .factory('SendForm', function($http) {
// 	return {
// 		all: function( url, dataObj ) {
// 			return $http.post( url, dataObj );
// 		}
// 	}
// })

// /**
//  * Gebruikt bij input[type=file]
//  */
// .directive('fileModel', ['$parse', function ($parse) {
//     return {
//         restrict: 'A',
//         link: function(scope, element, attrs) {
//             var model = $parse(attrs.fileModel);
//             var modelSetter = model.assign;

//             element.bind('change', function(){
//                 scope.$apply(function(){
//                     modelSetter(scope, element[0].files[0]);
//                 });
//             });
//         }
//     };
// }]);


