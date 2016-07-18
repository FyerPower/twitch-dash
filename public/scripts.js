(function() {
    'use strict';

    angular
        .module('application', [])
        .run(function(){})
        .config(ApplicationConfig)
        .controller('ApplicationController', ApplicationController);

    ApplicationConfig.$inject = ['$locationProvider', '$sceDelegateProvider'];
    function ApplicationConfig($locationProvider, $sceDelegateProvider){
        $locationProvider.html5Mode(true);
        $sceDelegateProvider.resourceUrlWhitelist([
            'self',
            'https://www.twitch.tv/**'
        ]);
    }

    ApplicationController.$inject = ['$http', '$interval', '$location', '$sce'];
    function ApplicationController($http, $interval, $location, $sce) {
        var app = this;

        app.channelName = $location.search().user || 'fyerpower';
        var BASE_INFO_REFRESH = 15000;    // update once every 15 seconds
        var CHATTER_INFO_REFRESH = 10000; // update once every 10 seconds

        app.displayName = null;
        app.online = false;
        app.game = 'Test Game';
        app.title = 'Test Streaming Title';
        app.logo = 'http://placehold.it/100x100';
        app.numViews = null;
        app.numViewers = null;
        app.numFollowers = null;
        app.numChatters = null;
        app.chatters = {
            moderators: [],
            staff: [],
            admin: [],
            global_mods: [],
            viewers: []
        };
        app.twitchChatUrl = $sce.trustAsResourceUrl("https://www.twitch.tv/"+app.channelName+"/chat");

        app.baseInfoUpdated = null;
        app.chatterInfoUpdated = null;

        GetBaseInfo();
        $interval(GetBaseInfo, BASE_INFO_REFRESH);

        GetChatterInfo();
        $interval(GetChatterInfo, CHATTER_INFO_REFRESH);

        function GetBaseInfo(){
            $http.get('https://api.twitch.tv/kraken/channels/'+app.channelName).success(function(response){
                // console.log("Base Info Data: ", response);
                app.displayName  = response.display_name;
                app.game      = response.game;
                app.title     = response.status;
                app.logo      = response.logo;
                app.numViews     = response.views;
                app.numFollowers = response.followers;
                app.baseInfoUpdated = new Date();
            });
            $http.get('https://api.twitch.tv/kraken/streams?channel='+app.channelName).success(function(response){
                app.online = (response._total === 1);
                if(app.online){
                    app.numViewers = response.streams[0].viewers;
                }
            });
        }

        function GetChatterInfo(){
            $http.get('/api/twitch/'+app.channelName+'/chatters.json').success(function(response){
                app.numChatters = response.chatter_count;
                app.chatters = response.chatters;
            });
        }

        return app;
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
