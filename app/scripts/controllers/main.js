'use strict';

/**
 * @ngdoc function
 * @name materialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the materialApp
 */
angular.module('materialApp')
  .controller('MainCtrl', function ($scope, $http) {

  	$scope.url = 'http://54.77.217.175';

  	$scope.artworks = [];
  	$scope.mediums = [];

    $scope.arrMaterials = [];  

    $scope.id = null;
  	$scope.artist = '';
  	$scope.title = '';
  	$scope.year = '';
  	$scope.description = '';
  	$scope.price = 0;
  	$scope.includes_vat = false;
  	$scope.vat = 0;
  	$scope.materials = '';
  	$scope.medium = null;
  	$scope.dimension1 = 0;
  	$scope.dimension2 = 0;
  	$scope.dimension3 = 0;
  	$scope.dimensions_in_cm = true;

    $scope.onlyNumbers = /^\d+$/;

	/* add new work  */
  	$scope.addArtWorks = function(){
  		$http({
  		    method: 'POST',
  		    url: $scope.url + '/artworks',
          headers: { 'Content-Type': 'application/json' },
          dataType: 'json',
  		    data: {
  	  				'artist' : $scope.artist,
  	  				'title' : $scope.title,
  	  				'year' : $scope.year,
  	  				'description' : $scope.description,
  	  				'price' : $scope.price,
    					'includes_vat' : $scope.includes_vat,
    					'vat' : $scope.vat,
    					'materials' : $scope.materials,
    					'medium' : $scope.url + '/mediums/' + $scope.medium,
    					'dimension1' : $scope.dimension1,
    					'dimension2' : $scope.dimension2,
    					'dimension3' : $scope.dimension3,
    					'dimensions_in_cm' : $scope.dimensions_in_cm
    				}
  		})
      .success(function(data, status, headers){

        var url = headers('Location');

        $('#formnewartist').get(0).reset();
        $('#create').trigger('click');
        $scope.getArtWork(url);

        $scope.addMaterials(url);
      })
      .error(function(){
      });
  	};

  	/* return list de works */
  	$scope.getArtWorks = function(){
  		$http.get($scope.url + '/artworks').success(function(response){

  			/* clear array */
  			$scope.artworks = [];

  			var data = response.urls;
  			var datalen = data.length;
  			var url;

  			for (var i = 0; i < datalen; i++) {
  				url = data[i];
  				$scope.getArtWork(url);
  			}
  		});
  	};

  	/* return obj work */
  	$scope.getArtWork = function(url){
  		$http.get(url).success(function(response){
        $scope.getMaterialsEach(response.materials, function(materialsArray){
          console.log('materialsArray', materialsArray);
          response.materials = materialsArray;
  			 $scope.artworks.push(response);
        });
  		});
  	};


    $scope.getMaterialsEach = function(resp, callback){
      $http.get(resp).success(function(response){

        var arrayMaterials = [];
        var data = response.urls;
        var datalen = data.length;
        var url;
        var addArrayMaterialsEach = function(resp){
          arrayMaterials.push(resp);    
        };

        for (var i = 0; i < datalen; i++) {
          url = data[i];
          $scope.getMaterial(url, addArrayMaterialsEach);
        }

        callback(arrayMaterials);
      });
    };

    $scope.getMaterial = function(url, callback){
      $http.get(url).success(function(resp){
        callback(resp);
      });
    };

  	/* return list de mediums */
  	$scope.getMediums = function(){
  		$http.get($scope.url + '/mediums').success(function(response){

  			var data = response.urls;
  			var datalen = data.length;
  			var url;

  			for (var i = datalen - 1; i >= 0; i--) {
  				url = data[i];
  				$scope.getMedium(url);
  			}
  		});
  	};

  	/* return object medium */
  	$scope.getMedium = function(url){
  		$http.get(url).success(function(response){
  			$scope.mediums.push(response);
  		});
  	};

  	/* remove work */
  	$scope.deleteArtist = function(id){
  		if(window.confirm('Do you have really to remove this work: '+ id +' ?')){
	  		$http.delete($scope.url + '/artworks/' + id).success(function(){
	  			$('#artwork-' + id).fadeOut();
	  		});
  		}
  	};

    /* add material in memory */
    $scope.addMaterial = function($event){


        $http({
            method: 'POST',
            url:  $scope.url + '/materials',
            headers: { 'Content-Type': 'application/json' },
            dataType: 'json',
            data: {
                'name' : $scope.txtMaterial
              }
        })
        .success(function(data, status, headers){
          var url = headers('Location');

          var obj = {
            'url' : url,
            'name' : $scope.txtMaterial
          };

          $scope.arrMaterials.push(obj);
          $scope.txtMaterial = '';
          $('#txtMaterial').focus();

        })
        .error(function(resp){
          console.log(resp);
        });



        if($event){
          $event.preventDefault();
        }
    };

    /* add material in memory */
    $scope.addMaterials = function(url){

      var len = $scope.arrMaterials.length;
      var urlPost = url + '/materials';

      for (var i = 0; i < len; i++) {

        $http({
            method: 'POST',
            url: urlPost,
            headers: { 'Content-Type': 'application/json' },
            dataType: 'json',
            data: {
                'name' : $scope.arrMaterials[i].name,
                'url' : $scope.arrMaterials[i].url
              }
        })
        .success(function(){
        })
        .error(function(){
        });
      }
    };

    /* remove material */
    $scope.deleteMaterial = function(id){
        //$scope.arrMaterials.push($scope.txtMaterial);
        $('#material-' + id).fadeOut();
        /*$http.delete($scope.url + '/artworks/' + id).success(function(){
          $('#artwork-' + id).fadeOut();
        });*/
    };

  	$scope.getMediums();
  	$scope.getArtWorks();
  });