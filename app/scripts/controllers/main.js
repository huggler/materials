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
  	$scope.artist = 'Felipe';
  	$scope.title = 'Title';
  	$scope.year = '2014';
  	$scope.description = 'Description';
  	$scope.price = '15000';
  	$scope.includes_vat = false;
  	$scope.vat = 0;
  	$scope.materials = '';
  	$scope.medium = 0;
  	$scope.dimension1 = 1;
  	$scope.dimension2 = 2;
  	$scope.dimension3 = 3;
  	$scope.dimensions_in_cm = true;

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
      .success(function(data, status, headers, config){

        var url = headers('Location');
        //var parseUrl = url.join("/");
        //console.log(parseUrl);
        //var id = url.replace(/\D/g, '');

        //window.alert(id);

        $('#form-new-artist').get(0).reset();
        $('#create').trigger('click');
        $scope.getArtWork(url);

        $scope.addMaterials(url, headers);
      })
      .error(function(resp){
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
        console.log('response', response);
        var arrayMaterials = [];
        var data = response.urls;
        var datalen = data.length;
        var url;

        for (var i = 0; i < datalen; i++) {
          url = data[i];
          $scope.getMaterial(url, function(resp){
            console.log(resp);
            arrayMaterials.push(resp);
          });
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

        $scope.arrMaterials.push($scope.txtMaterial);
        $scope.txtMaterial = '';
        $('#txtMaterial').focus();

        if($event){
          $event.preventDefault();
        }
    };

    /* add material in memory */
    $scope.addMaterials = function(url, headers){

      var len = $scope.arrMaterials.length;

      for (var i = 0; i < len; i++) {

        $http({
            method: 'POST',
            url: url + '/materials',
            headers: { 'Content-Type': 'application/json' },
            dataType: 'json',
            data: {
                'name' : $scope.arrMaterials[i],
                'url' : 404
              }
        })
        .success(function(data, status, headers, config){

          var url = headers('Location');
          console.log(url);

        })
        .error(function(resp){
          console.log(resp);
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

    /* get artWork in memory */
    $scope.getMemoryArtWork = function(url){

      var len = $scope.artworks.length;

      for (var i = 0; i < len; i++) {
        if($scope.artworks[i].url === url){
          return $scope.artworks[i];
          break;
        }
      };

      return false;
    };



  	$scope.getMediums();
  	$scope.getArtWorks();
  });