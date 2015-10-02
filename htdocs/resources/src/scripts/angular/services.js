angular.module('formServices', [])

.factory('FormService', function($http) {
	var data = {};

	return {
		get: function() {
			return data;
		},
		set: function( dataObj ) {
			for( item in dataObj ) {
				data[item] = dataObj[item];
			}
		},
		empty: function() {
			data = {};
		}
	}
});
