angular.module('formControllers', [])

.controller('FormCtrl', ['$scope', '$state', 'FormService', 'Upload', '$timeout', function ($scope, $state, FormService, Upload, $timeout) {
	$scope.sendForm = false;

	$scope.submit = function( e ) {
		e.preventDefault();

		if( $scope.formData.$invalid ) {
			$scope.$broadcast('record:invalid');
		}
		else {
			$scope.sendForm = true;
			sendData( FormService.get() );
		}
	}

	function splitFilesData( dataObj ) {
		var filesObj = {},
			fieldsObj = {};

		for( key in dataObj ) {
			if(
				typeof dataObj[ key ] === 'object' &&
				typeof dataObj[ key ].name === 'string' &&
				typeof dataObj[ key ].size === 'number' ) {

				filesObj[key] = dataObj[ key ];
			}
			else {
				fieldsObj[key] =  dataObj[ key ];
			}
		}

		return {
			filesObj: filesObj,
			fieldsObj: fieldsObj
		}
	}

	function sendData( dataObj ) {
		var formData = splitFilesData( dataObj );

		Upload.upload({
		  	url: $scope.actionUrl,
		  	method: 'POST',
		  	headers: {
				'X-Requested-With': 'XMLHttpRequest'
		  	},
		  	fields: {
			  	handle: 'angular',
			  	fields: formData.fieldsObj
		  	}
		  	,
		  	file: formData.filesObj
		}).then(function( response ) {
		  	$timeout(function () {
				$scope.sendForm = false;

				if( response.data.success ) {
			    	console.log('gelukt');
			    }
			    else {
			    	$scope.serverSideErrors = response.data.errors;
			    }
		  	});
		}, function( response ) {
		  	if( response.status > 0 ) {
		  		$scope.sendForm = false;
		  	}
		});
	}
}])

.controller('StepCtrl', function($scope, $state, FormService) {
	$scope.appform = FormService.get();

	$scope.checkStep = function( stepNumber ) {
		FormService.set( $scope.appform );

		if( $scope.formData.$invalid ) {
			$scope.$broadcast('record:invalid');
		}
		else {
			if( stepNumber < 3 ) {
				$state.go('form.step' + (stepNumber + 1));
			}
		}
	}
});
