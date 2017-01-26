angular.module('searchFilmApp', [])

function appController($scope) {
  $scope.search_field = '';
  $scope.last_search = '';
  $scope.resp = {};
  $scope.index_min;
  $scope.index_max;
  $scope.index_nav_min;
  $scope.index_nav_max;
  $scope.pages = [];
  $scope.items_per_page = 6;
  $scope.items_nav_per_page = 4;
  $scope.qty_pages_final;
  $scope.obj_details = {};
  $scope.show_details = false;
  $scope.show_nav = false;
  $scope.show_movie_list = true;
  $scope.items_per_search;
  $scope.selected = 0;

  $scope.searchFilm = function(){
      var url_search = 'http://www.omdbapi.com/?s=' + $scope.search_field;
      /*confere se a busca atual não é exatamente igual à anterior, evitando buscas desnecessárias*/
      if($scope.last_search != $scope.search_field){
        $.get(url_search, function(response) {
          if(response.Response == "True"){
          	$scope.items_per_search = response.Search.length;
            var qty_pages = Math.ceil(response.totalResults / response.Search.length);
            $scope.resp = response;
            $scope.pages = [];
            $scope.index_min = 0;
            $scope.index_max = $scope.items_per_page  - 1;
            $scope.index_nav_min = 0;
            $scope.index_nav_max = $scope.items_nav_per_page -1;
            $scope.show_nav = true;
            $scope.show_movie_list = true;
            $scope.show_details = false;
            $scope.obj_details = {};

            for(var i = 2; i <= $scope.items_nav_per_page; i++){
              $.get(url_search+"&page="+i, function(response){
              	if(response.Response == "True"){
	                for(var j = 0; j < response.Search.length; j++){
	                  $scope.resp.Search.push(response.Search[j]);
	                }
                }
              });
            }

            $scope.qty_pages_final = Math.ceil(response.totalResults / $scope.items_per_page);
            $scope.qty_pagination = Math.ceil($scope.qty_pages_final / $scope.items_nav_per_page);

            for(var k = 1; k <= $scope.qty_pages_final; k++){
              $scope.pages.push({num: k});
            }
          }else{
            $scope.show_nav = false;
            $scope.show_movie_list = false;
            $("#notFound").modal();
          }
          $scope.last_search = $scope.search_field;
          $scope.$apply();
        });
      }
  };

  $scope.searchDetails = function(imdbID){
    $scope.show_movie_list = false;
    $scope.show_nav = false;
    var url_search_details = "http://www.omdbapi.com/?i=" + imdbID;
    $.get(url_search_details, function(response){
      $scope.obj_details = response;
      $scope.show_details = true;
      $scope.$apply();
    });
  };

  $scope.closeDetails = function(){
    $scope.show_movie_list = true;
    $scope.show_nav = true;
    $scope.show_details = false;
    $scope.obj_details = {};
  };

  $scope.changePage = function(numSelected){
  	$scope.selected = numSelected.num - 1;
    $scope.index_max = (numSelected.num * $scope.items_per_page) - 1;
    $scope.index_min = ($scope.index_max - $scope.items_per_page) + 1;
  };

  $scope.nextPage = function(){
    var current_page = Math.ceil($scope.index_max / $scope.items_per_page);

    if(current_page < $scope.qty_pages_final){

    	/*confere se o número da navegação era o último, confirmando a necessidade de apresentar números novos na aba de navegação*/
      if(current_page % $scope.items_nav_per_page == 0){

      	/*altera o index mínimo e máximo p/ indicar quais filmes devem ficar visíveis na tela*/
        $scope.index_nav_min += $scope.items_nav_per_page;
        $scope.index_nav_max += $scope.items_nav_per_page;

        $scope.changePage({num: current_page + 1});

        /*confere se a quantidade de filmes no meu objeto já atingiu o total de filmes econtrados na busca*/
        if($scope.resp.Search.length < $scope.resp.totalResults){
        	var qty;

        	/*confere se a quantidade de filmes que falta buscar na api é maior que a quantidade que estamos tentando buscar (40 por chamada)*/
        	if(($scope.resp.totalResults - $scope.resp.Search.length) > ($scope.items_nav_per_page * $scope.items_per_search)){
        		qty = $scope.items_nav_per_page;
        	}else{
        		/*verifica quantas buscas ainda são necessárias p/ alcançar a quantidade total de filmes encontrados*/
        		qty = Math.ceil(($scope.resp.totalResults - $scope.resp.Search.length) / $scope.items_per_search);
        	}
        	for(var i = 1; i <= qty; i++){
      			var url_search = 'http://www.omdbapi.com/?s=' + $scope.last_search + "&page=" + (current_page + i);
      			$.get(url_search, function(response){
              for(var j = 0; j < response.Search.length; j++){
                $scope.resp.Search.push(response.Search[j]);
              }
              $scope.$apply();
            });
      		}
        }
      }else{
        $scope.changePage({num: current_page + 1});
      }
    }
  };

  $scope.prevPage = function(){
    var current_page = Math.ceil($scope.index_max / $scope.items_per_page);
    if(current_page != 1){
      if((current_page - 1) % $scope.items_nav_per_page == 0){
        $scope.index_nav_min -= $scope.items_nav_per_page;
        $scope.index_nav_max -= $scope.items_nav_per_page;
        $scope.changePage({num: current_page - 1});
      }else{
        $scope.changePage({num: current_page - 1});
      }
    }
  };
}