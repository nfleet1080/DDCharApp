// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var dndapp = angular.module('dndapp', ['ionic', 'ngStorage', 'dndDirectives', 'dndFactories']);
dndapp.filter("inRange", function () {
    return function (items, from, to) {
        var result = [];
        for (var i = 0; i < items.length; i++) {
            if (items[i] >= from && items[i] <= to) {
                result.push(items[i]);
            }
        }
        return result;
    };
});
dndapp.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('app', {
            url: "/main",
            abstract: true,
            templateUrl: "templates/main.html",
        })
        .state('app.home', {
            url: "/home",
            views: {
                'menuContent': {
                    templateUrl: "templates/home.html"
                }
            }
        })
        .state('generator', {
            url: "/generator",
            abstract: true,
            templateUrl: "templates/generator.html",
        })
        .state('generator.quick', {
            url: "/quick",
            parent: 'generator',
            views: {
                'generatorContent': {
                    templateUrl: "templates/quickRaceClass.html",
                    controller: function ($scope, DataService, DetailService) {
                    	$scope.helper = DetailService;
                    	
                    	$scope.races = DataService.Races();
                        $scope.selectedRace = 1;
                        $scope.subraces = DetailService.getRace($scope.selectedRace).subrace;
                        $scope.selectedSubRace = 1;
                        $scope.classes = DataService.Classes();                        
                        $scope.selectedClass = 1;
                    }
                }
            }
        })
        .state('generator.race', {
            url: "/race",
            parent: 'generator',
            views: {
                'generatorContent': {
                    templateUrl: "templates/race.html",
                    controller: function ($scope, DataService, DetailService) {
                        $scope.races = DataService.Races();
                        $scope.selectedRace = 1;
                        $scope.helper = DetailService;
                    }
                }
            }
        })
        .state('generator.race.detail', {
            url: "/:selectedRaceID",
            parent: 'generator',
            views: {
                'generatorContent': {
                    templateUrl: "templates/race.detail.html",
                    controller: function ($stateParams, $scope, $rootScope, $ionicHistory, $filter, DetailService, $state) {
                        $rootScope.TempCharacter.RaceID = $stateParams.selectedRaceID;
                        $scope.chosenRace = DetailService.getRace($stateParams.selectedRaceID);

                        $scope.helper = DetailService;

                        $scope.pickRace = function () {
                            if ($scope.chosenRace.subrace.length > 0) {
                                $state.go('generator.race.subrace');
                            } else {
                                // race has no subraces, so just skip
                                $state.go('generator.class');
                            }
                        };

                        // testing
                        //console.info(DetailService.formatMoney(278 * 41 + 5));
                    }
                }
            }
        })
        .state('generator.race.subrace', {
            url: "/subrace",
            parent: 'generator',
            views: {
                'generatorContent': {
                    templateUrl: "templates/race.subrace.html",
                    controller: function ($ionicHistory, $scope, $rootScope, $filter, DetailService) {
                        $scope.helper = DetailService;
                        // grab sub race data for selected race
                        $scope.subraces = DetailService.getRace($rootScope.TempCharacter.RaceID).subrace;
                        $scope.selectedSubRace = 1;
                    }
                }
            }
        })
        .state('generator.race.subrace.detail', {
            url: "/:selectedSubRaceID",
            parent: 'generator',
            views: {
                'generatorContent': {
                    templateUrl: "templates/race.subrace.detail.html",
                    controller: function ($stateParams, $scope, $rootScope, $ionicHistory, DetailService) {
                        // record sub race choice
                        $rootScope.TempCharacter.SubRaceID = $stateParams.selectedSubRaceID;
                        // grab sub race info for display
                        $scope.chosenSubRace = DetailService.getSubRace($rootScope.TempCharacter.RaceID, $stateParams.selectedSubRaceID);

                        $scope.helper = DetailService;
                    }
                }
            }
        })
        .state('generator.class', {
            url: "/class",
            parent: 'generator',
            views: {
                'generatorContent': {
                    templateUrl: "templates/class.html",
                    controller: function ($scope, DataService, DetailService) {
                    	$scope.helper = DetailService;
                    	
                    	$scope.classes = DataService.Classes();                        
                        $scope.selectedClass = 1;
                    }
                }
            }
        })
        .state('generator.class.detail', {
            url: "/:selectedClassID",
            parent: 'generator',
            views: {
                'generatorContent': {
                    templateUrl: "templates/class.detail.html",
                    controller: function ($stateParams, $scope, $rootScope, DetailService, $state) {
                        $rootScope.TempCharacter.ClassID = $stateParams.selectedClassID;
                        $scope.chosenClass = DetailService.getClass($stateParams.selectedClassID);

                        $scope.helper = DetailService;
                        $scope.Math = window.Math;

                        $scope.resolveOption = function (option) {
                            switch (option.Type) {
                                case "Weapon":
                                    return DetailService.getWeapon(option.id).name;
                                    break;
                                case "Armor":
                                    return DetailService.getArmor(option.id).name;
                                    break;
                                case "Equipment":
                                    switch (option.id) {
                                        case 5:
                                            return "any simple melee weapon";
                                            break;
                                        case 6:
                                            return "any simple ranged weapon";
                                            break;
                                        case 9:
                                            return "any simple weapon";
                                            break;
                                        case 7:
                                            return "any martial melee weapon";
                                            break;
                                        case 8:
                                            return "any martial ranged weapon";
                                            break;
                                        case 10:
                                            return "any martial weapon";
                                            break;
                                        default:
                                            return DetailService.getEquipmentType(option.id).name;
                                    }
                                    return s;
                                    break;
                                case "Pack":
                                    return DetailService.getPack(option.id).name;
                                    break;
                                case "Gear":
                                    return DetailService.getGear(option.id).name;
                                    break;
                                case "Category":
                                    return DetailService.getCategory(option.id).name;
                                    break;
                                default:
                            }
                        };
                        $scope.resolveAmmo = function (ammoID) {
                            if (ammoID) {
                                return DetailService.getGear(ammoID).name;
                            }
                        };
                    }
                }
            }
        })
        .state('app.manual', {
            url: "/manual",
            views: {
                'menuContent': {
                    templateUrl: "templates/manual.html",
                    controller: "ManualCtrl"
                }
            }
        })

    $urlRouterProvider.otherwise("/main/home");
});

dndapp.controller('MainCtrl', function ($scope, $rootScope, $ionicSideMenuDelegate, $localStorage) {

    // check / set values
    $rootScope.characters = $localStorage.characters;
    $rootScope.TempCharacter = {};


    $scope.toggleLeft = function () {
        $ionicSideMenuDelegate.toggleLeft();
    };
});


