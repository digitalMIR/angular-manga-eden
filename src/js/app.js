'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.version',
  'ui.bootstrap',
  'ui.select',
  'ngSanitize'
])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}])
.controller('MangaController', ['$scope','$http','$window', function($scope,$http,$window) {
	$scope.Math = $window.Math;
	$scope.page = 0;
	$scope.selectedId = null;
	$scope.chapterId = null;
	$scope.pageId = null;
	$scope.img = null;

   	$scope.titoli = {
		//repeatSelect: null,
		availableOptions: []
		//availableOptions: [
		//  {id: '1', name: 'Option A'},
		//  {id: '2', name: 'Option B'},
		//  {id: '3', name: 'Option C'}
		//],
	};

	$scope.$watch('page', function() {
		resetUscite();
		resetPagine();

		$http({
			method: 'GET',
			url: 'https://www.mangaeden.com/api/list/1/',
			params:{p: $scope.page}
		})
		//$http.get('https://www.mangaeden.com/api/list/1/',{params{'p':'0'}})
		.then(function successCallback(response) {
   			//$scope.data.availableOptions = JSON.stringfy(response).manga;
   			//$scope.data.availableOptions = [{'i': '1', 't': 'OK'}];
   			//console.log(response.data);
   			$scope.titoli.availableOptions = response.data.manga;
   			$scope.titoli.end = response.data.end;
   			$scope.titoli.start = response.data.start;
   			$scope.titoli.page = response.data.page;
   			$scope.titoli.total = response.data.total;
		}, function errorCallback(response) {
   			$scope.titoli.availableOptions = [{i: '1', t: 'Error'}];
		});
	});

	$scope.uscite = {
		availableOptions: []
	};

	$scope.$watch('selectedId', function() {
		resetPagine();

		if ( $scope.selectedId != null ) {
			$http({
				method: 'GET',
				url: 'https://www.mangaeden.com/api/manga/'+$scope.selectedId+'/'	
			})
			.then(function successCallback(response) {
				$scope.img = (response.data.image?'https://cdn.mangaeden.com/mangasimg/600x/'+response.data.image:null);
	   			$scope.uscite.availableOptions = (response.data.chapters?response.data.chapters.reverse():null);
	   			$scope.uscite.total = response.data.chapters_len;
				$scope.uscite.autore = response.data.author;	
				$scope.uscite.anno = response.data.released;	
				$scope.uscite.descrizione = response.data.description;	
			}, function errorCallback(response) {
   				$scope.uscite.availableOptions = [{i: '1', t: 'Error'}];
			});
		}
	});

	$scope.pagine = {
		availableOptions: []
	};

	$scope.$watch('chapterId', function() {
		if ( $scope.chapterId != null ) {
			$http({
				method: 'GET',
				url: 'https://www.mangaeden.com/api/chapter/'+$scope.chapterId+'/'
			})
			.then(function successCallback(response) {
				//https://cdn.mangaeden.com/mangasimg/aa/aa3b2844bdab6d8c45f7454051f15bb680a7235c5fe0ac01ac64340d.jpg
	   			$scope.pagine.availableOptions = (response.data.images?response.data.images.reverse():null);
	   			$scope.pagine.total = response.data.images.length;
			}, function errorCallback(response) {
   				$scope.pagine.availableOptions = [{i: '1', t: 'Error'}];
			});
		}
	});


	$scope.$watch('pageId', function() {
		if ( $scope.pageId != null ) {
			$scope.imgPage='https://cdn.mangaeden.com/mangasimg/'+$scope.pageId
		}
	});

	var resetPagine = function() {
		$scope.imgPage=null;
		$scope.pagine.availableOptions = [];
		$scope.pagine.total = null;
	}

	var resetUscite = function() {
		$scope.img = null;
		$scope.uscite.availableOptions = [];
		$scope.uscite.total = null;	
		$scope.uscite.autore = null;	
		$scope.uscite.anno = null;	
		$scope.uscite.descrizione = null;	
	}

}])
;
