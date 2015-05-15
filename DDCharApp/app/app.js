﻿// Ionic Starter App

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
        .state('generator.quickRaceClass', {
            url: "/quickRaceClass",
            parent: 'generator',
            views: {
                'generatorContent': {
                    templateUrl: "templates/quickRaceClass.html",
                    controller: function ($scope, $rootScope, DataService, DetailService, $state) {
                        $scope.helper = DetailService;

                        $scope.update = function () {
                            $scope.subraces = $scope.helper.getRace($scope.selectedRace.id).subrace;
                            $scope.selectedSubRace = $scope.subraces[0];
                        }

                        // grab races and set default selection
                        $scope.races = DataService.Races();
                        $scope.selectedRace = $scope.races[0];
                        // grab subraces and set default
                        $scope.update();
                    	
                        // grab classes and set default
                        $scope.classes = DataService.Classes();
                        $scope.selectedClass = $scope.classes[0];

                        $scope.selectClass = function () {
                            $rootScope.TempCharacter.RaceID = $scope.selectedRace.id;
                            $rootScope.TempCharacter.SubRaceID = $scope.selectedSubRace.id;
                            $rootScope.TempCharacter.ClassID = $scope.selectedClass.id;

                            //console.table($rootScope.TempCharacter);
                            $scope.$emit('raceChanged');
                            $state.go('generator.quickAbilityScores', {}, {
                                reload: true,
                                inherit: false,
                                notify: true
                            });
                        }
                    }
                }
            }
        })
        .state('generator.quickAbilityScores', {
            url: "/quickAbilityScores",
            parent: 'generator',
            views: {
                'generatorContent': {
                    templateUrl: "templates/quickAbilityScores.html",
                    controller: function ($scope, $rootScope, DataService, DetailService, $ionicHistory,$filter) {
                        
                        $scope.roll = function () {
                            // clear the existing roll results
                            $scope.rollResults.length = 0

                            // for each of the 6 possible scores...
                            for (i = 0; i < 6; i++) {
                                // Roll four 6-sided dice and record the total of the highest three dice
                                var rolls = [];
                                for (r = 0; r < 4; r++) {
                                    rolls.push(DetailService.roll(1, 6, 1)[0]);
                                }
                                // sort the array from lowest to highest
                                rolls.sort(function (a, b) { return a - b });
                                // remove the lowest recorded value (first index)
                                rolls.splice(1, 1);

                                // now that we have the three highest values, add them
                                var sum = 0;
                                for (var s = 0; s < rolls.length; s++) {
                                    sum += rolls[s];
                                }

                                // finally, add this fancy value to the roll results
                                $scope.rollResults.push(sum);
                            }
                            $scope.rollResults.sort(function(a, b){return b-a});

                        };

                        // get individual racial stat bonus for a specific stat
                        $scope.getStatBonus = function (id) {
                            return DetailService.getStatBonus(id, $rootScope.TempCharacter.RaceID, $rootScope.TempCharacter.SubRaceID).bonus;
                        };

                        $scope.helper = DetailService;

                        // for holding 4d6 roll results
                        $scope.rollResults = [];

                        // static scores (quick)
                        $scope.staticScores = [15, 14, 13, 12, 10, 8];

                        // initial 4d6 roll
                        $scope.roll();

                        // point buy variable
                        $scope.pointBuy = {
                            "points":27,
                            "str": 8,
                            "dex": 8,
                            "con": 8,
                            "int": 8,
                            "wis": 8,
                            "chr": 8,
                        }
                        var pointCostValues = [
                                { "point": 8, "cost": 0 },
                                { "point": 9, "cost": 1 },
                                { "point": 10, "cost": 2 },
                                { "point": 11, "cost": 3 },
                                { "point": 12, "cost": 4 },
                                { "point": 13, "cost": 5 },
                                { "point": 14, "cost": 7 },
                                { "point": 15, "cost": 9 },
                        ];
                        function pointCost(point) {
                            return ($filter('filter')(pointCostValues, { point: Number(point) }, true))[0].cost;
                        }
                        // function to calculate currently used points
                        $scope.calculatePoints = function () {
                            var runningTotal = $scope.pointBuy.points;
                            runningTotal -= pointCost($scope.pointBuy.str);
                            runningTotal -= pointCost($scope.pointBuy.dex);
                            runningTotal -= pointCost($scope.pointBuy.con);
                            runningTotal -= pointCost($scope.pointBuy.int);
                            runningTotal -= pointCost($scope.pointBuy.wis);
                            runningTotal -= pointCost($scope.pointBuy.chr);
                            return runningTotal;
                        }

                        $scope.notEnoughPoints = function(abl){
                            // determine if there are enough points to increase
                            // first figure out the number the next available number
                            var valToIncrease = $scope.pointBuy[abl] + 1;
                            var newcost = 0;
                            var currentcost = pointCost($scope.pointBuy[abl]);
                            if (valToIncrease < 16) {
                                newcost = pointCost(valToIncrease);
                            }else{
                                return true;
                            }
                            // look at the current remaining points...
                            var currentPoints = $scope.calculatePoints();
                            if (currentPoints - (newcost - currentcost) >= 0) {
                                return false;
                            } else {
                                return true;
                            }

                        };

                        $scope.getAbilities = function () {
                            return DetailService.getRacialStatBonuses($rootScope.TempCharacter.RaceID, $rootScope.TempCharacter.SubRaceID);
                        };
                        $scope.abilities = $scope.getAbilities();

                        $scope.moveItem = function (item, fromIndex, toIndex) {
                            //Move the item in the array
                            $scope.abilities.splice(fromIndex, 1);
                            $scope.abilities.splice(toIndex, 0, item);
                        };

                        $rootScope.$on('raceChanged', function () {
                            $scope.abilities = $scope.getAbilities();
                        });
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


