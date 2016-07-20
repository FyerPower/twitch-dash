(function() {
    'use strict';

    angular
        .module('twitchboard', ['ui.router', 'templates'])
        .config(ApplicationConfig)
        .run(function(){})
        .controller('AppController', AppController)
        .controller('HomeController', HomeController)
        .controller('DashboardController', DashboardController);

    ApplicationConfig.$inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider', '$sceDelegateProvider'];
    function ApplicationConfig($locationProvider, $stateProvider, $urlRouterProvider, $sceDelegateProvider){
        console.log("Inside ApplicationConfig");

        $locationProvider.html5Mode(true);
        $sceDelegateProvider.resourceUrlWhitelist([
            'self',
            'https://www.twitch.tv/**'
        ]);

        $urlRouterProvider.rule(function ($injector, $location) {
            if($location.search().goto){
                return $location.search().goto;
            }
        });

        $stateProvider
            .state('home', {
                url: '/?goto',
                templateUrl: "home.html",
                controller: "HomeController",
                controllerAs: 'vm'
            })
            .state('dashboard', {
                url: '/{username}',
                templateUrl: "dashboard.html",
                controller: "DashboardController",
                controllerAs: 'vm'
            });

        $urlRouterProvider.otherwise("/");
    }

    AppController.$inject = ['$scope', '$window'];
    function AppController($scope, $window) {
        var app = this;

        app.windowHeight = $window.innerHeight;
        angular.element($window).bind('resize', function(){
            app.windowHeight = $window.innerHeight;
            $scope.$digest();
        });

        return app;
    }

    HomeController.$inject = [];
    function HomeController() {
    }

    DashboardController.$inject = ['$stateParams', '$http', '$interval', '$location', '$sce'];
    function DashboardController($stateParams, $http, $interval, $location, $sce) {
        var vm = this;

        vm.channelName = $stateParams.username || 'fyerpower';
        var BASE_INFO_REFRESH = 15000;    // update once every 15 seconds
        var CHATTER_INFO_REFRESH = 10000; // update once every 10 seconds

        vm.displayName = null;
        vm.online = false;
        vm.game = 'Test Game';
        vm.title = 'Test Streaming Title';
        vm.logo = 'http://placehold.it/100x100';
        vm.numViews = null;
        vm.numViewers = null;
        vm.numFollowers = null;
        vm.numChatters = null;
        vm.chatters = {
            moderators: [],
            staff: [],
            admin: [],
            global_mods: [],
            viewers: []
        };
        vm.twitchChatUrl = $sce.trustAsResourceUrl("https://www.twitch.tv/"+vm.channelName+"/chat");

        vm.baseInfoUpdated = null;
        vm.chatterInfoUpdated = null;

        GetBaseInfo();
        $interval(GetBaseInfo, BASE_INFO_REFRESH);

        GetChatterInfo();
        $interval(GetChatterInfo, CHATTER_INFO_REFRESH);

        function GetBaseInfo(){
            $http.get('https://api.twitch.tv/kraken/channels/'+vm.channelName).success(function(response){
                // console.log("Base Info Data: ", response);
                vm.displayName  = response.display_name;
                vm.game      = response.game;
                vm.title     = response.status;
                vm.logo      = response.logo;
                vm.numViews     = response.views;
                vm.numFollowers = response.followers;
                vm.baseInfoUpdated = new Date();
            });
            $http.get('https://api.twitch.tv/kraken/streams?channel='+vm.channelName).success(function(response){
                vm.online = (response._total === 1);
                if(vm.online){
                    vm.numViewers = response.streams[0].viewers;
                }
            });
        }

        function GetChatterInfo(){
            $http.get('/api/twitch/'+vm.channelName+'/chatters.json').success(function(response){
                vm.numChatters = response.chatter_count;
                vm.chatters = response.chatters;
            });
        }

        return vm;
    }
})();







// Channel Information:
//     https://api.twitch.tv/kraken/channels/fyerpower
//
// Fields:
//     game       - Current Game
//     status     - Stream Title
//     logo       - channel owner logo
//     delay      - current delay (always null?)
//     followers  - number of followers
//     views      - number of views
//
// Channel Chatters:
//     http://tmi.twitch.tv/group/user/fyerpower/chatters
//
// Fields:
//     chatter_count: 2,
//     chatters: {
//         moderators: [
//             "fyerpower",
//             "nightbot"
//         ],
//         staff: [ ],
//         admins: [ ],
//         global_mods: [ ],
//         viewers: [ ]
//     }
//
// Game Info:
//     https://api.twitch.tv/kraken/search/games?q=crea&type=suggest
//
// Fields:
//     games: Array
//         name
//         box.small
