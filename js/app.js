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

  $scope.searchFilm = function(){
      var url_search = 'http://www.omdbapi.com/?s=' + $scope.search_field;
      if($scope.last_search != $scope.search_field){
        console.log("entrou no if", $scope.last_search);
        $.get(url_search, function(response) {
          if(response.Response == "True"){
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

            for(var i = 2; i <= qty_pages; i++){
              $.get(url_search+"&page="+i, function(response){
                for(var j = 0; j < response.Search.length; j++){
                  $scope.resp.Search.push(response.Search[j]);
                }
              });
            }

            $scope.qty_pages_final = Math.ceil(response.totalResults / $scope.items_per_page);
            $scope.qty_pagination = Math.ceil($scope.qty_pages_final / 3);

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
    console.log("entrei na function");
    $scope.show_movie_list = false;
    $scope.show_nav = false;
    var url_search_details = "http://www.omdbapi.com/?i=" + imdbID;
    $.get(url_search_details, function(response){
      console.log("entrei no get", response);
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
    $scope.index_max = (numSelected.num * $scope.items_per_page) - 1;
    $scope.index_min = ($scope.index_max - $scope.items_per_page) + 1;
  };

  $scope.nextPage = function(){
    var current_page = Math.ceil($scope.index_max / $scope.items_per_page);
    if(current_page < $scope.qty_pages_final){
      if(current_page % $scope.items_nav_per_page == 0){
        $scope.index_nav_min += $scope.items_nav_per_page;
        $scope.index_nav_max += $scope.items_nav_per_page;
        $scope.changePage({num: current_page + 1});
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