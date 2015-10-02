angular.module('formApp', [
	'ui.router',
	'ngMessages',
	'ngFileUpload',
	'global',
	'formControllers',
	'formServices'
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
			templateUrl: FW.Config.submap + 'angular/step1.twig',
			controller: 'StepCtrl'
		})

		// url will be /form/step1
		.state('form.step2', {
			url: '/step2',
			templateUrl:  FW.Config.submap + 'angular/step2.twig',
			controller: 'StepCtrl'
		})
		// url will be /form/step3
		.state('form.step3', {
			url: '/step3',
			templateUrl: FW.Config.submap + 'angular/step3.twig',
			controller: 'StepCtrl'
		});

	// send users to the form page
	$urlRouterProvider.otherwise('/form/step1');
});
