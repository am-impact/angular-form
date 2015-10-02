angular.module('formControllers', [])

.controller('FormCtrl', ['$scope', '$state', 'FormService', 'Upload', '$timeout', function ($scope, $state, FormService, Upload, $timeout) {
	var filesObj = {},
		fieldsObj = {};

	/* Wordt gebruikt voor de loader bij submitten */
	$scope.sendForm = false;

	/**
	 * Submit actie van het formulier
	 * Loader wordt aangezet en sendData wordt aangeroepen met de formdata erin
	 */
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

	/**
	 * Data uit form splitten in verschillende objecten, zodat dit goed gaat met Craft
	 * Bestanden gaan in een aparte object
	 */
	function splitFilesData( dataObj ) {
		var filesObj = {},
			fieldsObj = {};

		for( key in dataObj ) {
			if(
				/* Check of het een bestand is */
				(typeof dataObj[ key ] === 'object' &&
				typeof dataObj[ key ].name === 'string' &&
				typeof dataObj[ key ].size === 'number')
				||
				/* Bij multiple files, is het een array, dan ff checken op het eerste item */
				( angular.isArray( dataObj[ key ] ) &&
				dataObj[ key ].length > 0 &&
				typeof dataObj[ key ][0] === 'object' &&
				typeof dataObj[ key ][0].name === 'string' &&
				typeof dataObj[ key ][0].size === 'number')
			) {

				filesObj[key] = dataObj[ key ];
			}
			/* Anders is het een 'gewoon' veld (geen file) */
			else {
				fieldsObj[key] =  dataObj[ key ];
			}
		}

		return {
			filesObj: filesObj,
			fieldsObj: fieldsObj
		}
	}

	/**
	 * Formulier submitten
	 */
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
			    	/* TODO:
			    		Melding tonen
			    		console.log verwijderen
			    	 */
			    	console.log('gelukt');

			    	/* Scope weer leeggooien */
			    	FormService.empty();

			    	/* Naar stap 1 */
			    	$state.go('form');
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

/**
 * Controller die bij elke stap wordt uitgevoerd
 */
.controller('StepCtrl', function($scope, $state, FormService) {
	/* Ingevulde data tot nu toe ophalen */
	$scope.appform = FormService.get();

	/* Klikken naar volgende stap */
	$scope.checkStep = function( stepNumber ) {
		/* Ingevulde date naar service schieten */
		FormService.set( $scope.appform );

		if( $scope.formData.$invalid ) {
			$scope.$broadcast('record:invalid');
		}
		else {
			/* Als we nog niet bij de laatste stap zijn, dan volgende stap */
			if( stepNumber < 3 ) {
				$state.go('form.step' + (stepNumber + 1));
			}
		}
	}
});
