var dndapp = angular.module('dndFactories', ['ionic', 'ngStorage']);

dndapp.factory('DetailService', function ($filter, DataService) {
    // quick way to return all details of a chosen race
    return {
        roll: function (min, max, count) {
            if (!count) {
                count = 1;
            }
            var r = [];
            for (var i = 0; i < count; i++) {
                r.push(Math.floor(Math.random() * (max - min + 1) + min));
            }
            return r;
        },
        getRacialStatBonuses: function (raceID, subRaceID) {
            var Abilities = [];
            for (var i = 0; i < DataService.AbilityScores().length; i++) {
                // get default abilities
                var currentAbility = DataService.AbilityScores()[i];
                Abilities.push({ "id": currentAbility.id, "name": currentAbility.name, "bonus": 0 });
            }
            // get the race bonuses
            var race = this.getRace(raceID);
            for (var r = 0; r < race.ASI.length; r++) {
                var raceAbility = race.ASI[r];
                for (var a = 0; a < Abilities.length; a++) {
                    if (raceAbility.id == Abilities[a].id) {
                        Abilities[a].bonus += raceAbility.bonus;
                    }
                }
            }
            // get the subrace bonuses
            var subrace = this.getSubRace(raceID, subRaceID);
            for (var r = 0; r < subrace.ASI.length; r++) {
                var raceAbility = subrace.ASI[r];
                for (var a = 0; a < Abilities.length; a++) {
                    if (raceAbility.id == Abilities[a].id) {
                        Abilities[a].bonus += raceAbility.bonus;
                    }
                }
            }

            return Abilities;
        },
        getStatBonus: function (abilityID, raceID, subRaceID) {
            var Abilities = this.getRacialStatBonuses(raceID, subRaceID);
            return ($filter('filter')(Abilities, { id: Number(abilityID) }, true))[0];
        },
        getLanguage: function (languageID) {
            return ($filter('filter')(DataService.Languages(), { id: Number(languageID) }, true))[0];
        },
        getRace: function (raceID) {
            return ($filter('filter')(DataService.Races(), { id: Number(raceID) }, true))[0];
        },
        getSubRace: function (raceID, subRaceID) {
            var race = this.getRace(raceID);
            return ($filter('filter')(race.subrace, { id: Number(subRaceID) }, true))[0];
        },
        getASI: function (asiID) {
            return ($filter('filter')(DataService.AbilityScores(), { id: Number(asiID) }, true))[0];
        },
        getSkill: function (skillID) {
            return ($filter('filter')(DataService.Skills(), { id: Number(skillID) }, true))[0];
        },
        getClass: function (classID) {
            return ($filter('filter')(DataService.Classes(), { id: Number(classID) }, true))[0];
        },
        getEquipmentType: function (typeID) {
            return ($filter('filter')(DataService.EquipmentType(), { id: Number(typeID) }, true))[0];
        },
        getArmor: function (armorID) {
            return ($filter('filter')(DataService.Armor(), { id: Number(armorID) }, true))[0];
        },
        getWeapon: function (weaponID) {
            return ($filter('filter')(DataService.Weapons(), { id: Number(weaponID) }, true))[0];
        },
        getTool: function (toolID) {
            return ($filter('filter')(DataService.Tools(), { id: Number(toolID) }, true))[0];
        },
        getGear: function (gearID) {
            return ($filter('filter')(DataService.AdventuringGear(), { id: Number(gearID) }, true))[0];
        },
        getPack: function (packID) {
            return ($filter('filter')(DataService.EquipmentPacks(), { id: Number(packID) }, true))[0];
        },
        getCategory: function (categoryID) {
            return ($filter('filter')(DataService.ItemCategory(), { id: Number(categoryID) }, true))[0];
        },
        formatMoney: function (copperAmount) {
            /*
            Coin            cp      sp      ep      gp      pp
            Copper (cp)     1       1/10    1/50    1/100   1/1,000
            Silver (sp)     10      1       1/5     1/10    1/100
            Electrum (ep)   50      5       1       1/2     1/20
            Gold (gp)       100     10      2       1       1/10
            Platinum (pp)   1,000   100     20      10      1
            */

            // excluding uncommon/unusual coin (pp and ep)
            if (!isNaN(parseFloat(copperAmount))) {
                // determine the Gold amount
                equ = copperAmount / 100;
                var gp = Math.floor(equ);
                remainder = Math.round((equ % 1) * 100);

                console.log("equ=" + equ);
                console.log("current remainder : " + remainder);

                // determine the Silver & Copper amount
                equ = remainder / 10;
                var sp = Math.floor(equ);
                var cp = Math.round((equ % 1) * 10);

                return (gp > 0 ? $filter('number')(gp) + " gp " : "") + (sp > 0 ? $filter('number')(sp) + " sp " : "") + (cp > 0 ? $filter('number')(cp) + " cp " : "").trim();
            }
        },
        convertHeight: function (inches) {
            var feet = Math.floor(inches / 12);
            inches %= 12;
            return feet + "'" + inches + '"';
        },
        generateName: function (raceID, sex) {
            var nameData = this.getRace(raceID).names;
            var firstName, lastName = nameData.last[this.roll(1, nameData.last.length, 1) - 1];

            switch (sex) {
                case 'Male':
                    firstName = nameData.male[this.roll(1, nameData.male.length, 1) - 1];
                    break;
                case 'Female':
                    firstName = nameData.female[this.roll(1, nameData.female.length, 1) - 1];
                    break;
            }

            return firstName + ' ' + lastName;
        },
    }
});
dndapp.factory('DataService', function () {
    return {
        Languages: function () {
            return [
                { 'id': 1, 'Language': 'Common', 'Typical Speakers': ['Humans'], 'Script': 'Common' },
                { 'id': 2, 'Language': 'Dwarvish', 'Typical Speakers': ['Dwarves'], 'Script': 'Dwarvish' },
                { 'id': 3, 'Language': 'Elvish', 'Typical Speakers': ['Elves'], 'Script': 'Elvish' },
                { 'id': 4, 'Language': 'Giant', 'Typical Speakers': ['Ogres', 'Giants'], 'Script': 'Dwarvish' },
                { 'id': 5, 'Language': 'Gnomish', 'Typical Speakers': ['Gnomes'], 'Script': 'Dwarvish' },
                { 'id': 6, 'Language': 'Goblin', 'Typical Speakers': ['Goblinoids'], 'Script': 'Dwarvish' },
                { 'id': 7, 'Language': 'Halfling', 'Typical Speakers': ['Halflings'], 'Script': 'Common' },
                { 'id': 8, 'Language': 'Orc', 'Typical Speakers': ['Orcs'], 'Script': 'Dwarvish' },
                { 'id': 9, 'Language': "Player's Choice", 'Typical Speakers': [], 'Script': '' }
            ];
        },
        Races: function () {
            return [
          {
              'id': 1,
              'name': 'Dwarf',
              'image': 'images/dwarf.svg',
              'description': "Kingdoms rich in ancient grandeur, halls carved into the roots of mountains, the echoing of picks and hammers in deep mines and blazing forges, a commitment to clan and tradition, and a burning hatred of goblins and orcs—these common threads unite all dwarves.",
              'ASI': [{ 'id': 3, 'bonus': 2 }],
              'age': 50,
              'ageDesc': "Dwarves mature at the same rate as humans, but they’re considered young until they reach the age of 50. On average, they live about 350 years.",
              'alignment': 'Lawful Good',
              'size': 'Medium',
              'names': {
                  'male': ['Adrik', 'Alberich', 'Baern', 'Barendd', 'Brottor', 'Bruenor', 'Dain', 'Darrak', 'Delg', 'Eberk', 'Einkil', 'Fargrim', 'Flint', 'Gardain', 'Harbek', 'Kildrak', 'Morgran', 'Orsik', 'Oskar', 'Rangrim', 'Rurik', 'Taklinn', 'Thoradin', 'Thorin', 'Tordek', 'Traubon', 'Travok', 'Ulfgar', 'Veit', 'Vondal'],
                  'female': ['Amber', 'Artin', 'Audhild', 'Bardryn', 'Dagnal', 'Diesa', 'Eldeth', 'Falkrunn', 'Finellen', 'Gunnloda', 'Gurdis', 'Helja', 'Hlin', 'Kathra', 'Kristryd', 'Ilde', 'Liftrasa', 'Mardred', 'Riswynn', 'Sannl', 'Torbera', 'Torgga', 'Vistra'],
                  'last': ['Balderk', 'Battlehammer', 'Brawnanvil', 'Dankil', 'Fireforge', 'Frostbeard', 'Gorunn', 'Holderhek', 'Ironfist', 'Loderr', 'Lutgehr', 'Rumnaheim', 'Strakeln', 'Torunn', 'Ungart']
              },
              'speed': 25,
              'traits': [
                { 'name': 'Darkvision', 'description': 'Accustomed to life underground, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can’t discern color in darkness, only shades of gray.' },
                { 'name': 'Dwarven Resilience', 'description': 'You have advantage on saving throws against poison, and you have resistance against poison damage.' },
                { 'name': 'Dwarven Combat Training', 'description': 'You have proficiency with the battleaxe, handaxe, throwing hammer, and warhammer.' },
                { 'name': 'Tool Proficiency', 'description': 'You gain proficiency with the artisan’s tools of your choice: smith’s tools, brewer’s supplies, or mason’s tools.' },
                { 'name': 'Stonecunning', 'description': 'Whenever you make an Intelligence (History) check related to the origin of stonework, you are considered proficient in the History skill and add double your proficiency bonus to the check, instead of your normal proficiency bonus.' }
              ],
              'languages': [1, 2],
              'subrace': [
                  {
                      'id': 1,
                      'name': 'Hill Dwarf',
                      'description': '<p>As a hill dwarf, you have keen senses, deep intuition, and remarkable resilience. The gold dwarves of Faerûn in their mighty southern kingdom are hill dwarves, as are the exiled Neidar and the debased Klar of Krynn in the Dragonlance setting.</p>',
                      'ASI': [{ 'id': 5, 'bonus': 1 }],
                      'traits': [
                          {
                              'name': 'Dwarven Toughness',
                              'description': 'Your hit point maximum increases by 1, and it increases by 1 every time you gain a level.'
                          }
                      ],
                      'baseHeight': 44, //inches
                      'heightModifier': { 'qty': 2, 'die': 4 },
                      'baseWeight': 115, //lbs
                      'weightModifier': { 'qty': 2, 'die': 6 },
                  },
                  {
                      'id': 2,
                      'name': 'Mountain Dwarf',
                      'description': '<p>As a mountain dwarf, you’re strong and hardy, accustomed to a difficult life in rugged terrain. You’re probably on the tall side (for a dwarf), and tend toward lighter coloration. The shield dwarves of northern Faerûn, as well as the ruling Hylar clan and the noble Daewar clan of Dragonlance, are mountain dwarves.</p>',
                      'ASI': [{ 'id': 1, 'bonus': 2 }],
                      'traits': [
                          {
                              'name': 'Dwarven Armor Training',
                              'description': 'You have proficiency with light and medium armor.'
                          }
                      ],
                      'baseHeight': 48, //inches
                      'heightModifier': { 'qty': 2, 'die': 4 },
                      'baseWeight': 130, //lbs
                      'weightModifier': { 'qty': 2, 'die': 6 },
                  }
              ]
          },
          {
              'id': 2,
              'name': 'Elf',
              'image': 'images/elf.svg',
              'description': '<p>Elves are a magical people of otherworldly grace, living in the world but not entirely part of it. They live in places of ethereal beauty, in the midst of ancient forests or in silvery spires glittering with faerie light, where soft music drifts through the air and gentle fragrances waft on the breeze. Elves love nature and magic, art and artistry, music and poetry, and the good things of the world.</p>',
              'ASI': [{ 'id': 2, 'bonus': 2 }],
              'age': 100,
              'ageDesc': "An elf typically claims adulthood and an adult name around the age of 100 and can live to be 750 years old.",
              'alignment': 'Chaotic Good',
              'size': 'Medium',
              'names': {
                  'male': ['Adran', 'Aelar', 'Aramil', 'Arannis', 'Aust', 'Beiro', 'Berrian', 'Carric', 'Enialis', 'Erdan', 'Erevan', 'Galinndan', 'Hadarai', 'Heian', 'Himo', 'Immeral', 'Ivellios', 'Laucian', 'Mindartis', 'Paelias', 'Peren', 'Quarion', 'Riardon', 'Rolen', 'Soveliss', 'Thamior', 'Tharivol', 'Theren', 'Varis'],
                  'female': ['Adrie', 'Althaea', 'Anastrianna', 'Andraste', 'Antinua', 'Bethrynna', 'Birel', 'Caelynn', 'Drusilia', 'Enna', 'Felosial', 'Ielenia', 'Jelenneth', 'Keyleth', 'Leshanna', 'Lia', 'Meriele', 'Mialee', 'Naivara', 'Quelenna', 'Quillathe', 'Sariel', 'Shanairra', 'Shava', 'Silaqui', 'Theirastra', 'Thia', 'Vadania', 'Valanthe', 'Xanaphia'],
                  'last': ['Amakiir (Gemflower)', 'Amastacia (Starflower)', 'Galanodel (Moonwhisper)', 'Holimion (Diamonddew)', 'Ilphelkiir (Gemblossom)', 'Liadon (Silverfrond)', 'Meliamne (Oakenheel)', 'Naïlo (Nightbreeze)', 'Siannodel (Moonbrook)', 'Xiloscient (Goldpetal)']
              },
              'speed': 30,
              'traits': [
                { 'name': 'Darkvision', 'description': 'Accustomed to twilit forests and the night sky, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can’t discern color in darkness, only shades of gray.' },
                { 'name': 'Keen Senses', 'description': 'You have proficiency in the Perception skill.' },
                { 'name': 'Fey Ancestry', 'description': 'You have advantage on saving throws against being charmed, and magic can’t put you to sleep.' },
                { 'name': 'Trance', 'description': 'Elves don’t need to sleep. Instead, they meditate deeply, remaining semiconscious, for 4 hours a day. (The Common word for such meditation is “trance.”) While meditating, you can dream after a fashion; such dreams are actually mental exercises that have become reflexive through years of practice. After resting in this way, you gain the same benefit that a human does from 8 hours of sleep.' }
              ],
              'languages': [1, 3],
              'subrace': [
                  {
                      'id': 1,
                      'name': 'High Elf',
                      'description': '<p>As a high elf, you have a keen mind and a mastery of at least the basics of magic. In many of the worlds of D&D, there are two kinds of high elves. One type (which includes the gray elves and valley elves of Greyhawk, the Silvanesti of Dragonlance, and the sun elves of the Forgotten Realms) is haughty and reclusive, believing themselves to be superior to non-elves and even other elves. The other type (including the high elves of Greyhawk, the Qualinesti of Dragonlance, and the moon elves of the Forgotten Realms) are more common and more friendly, and often encountered among humans and other races.</p><p>The sun elves of Faerûn (also called gold elves or sunrise elves) have bronze skin and hair of copper, black, or golden blond. Their eyes are golden, silver, or black. Moon elves (also called silver elves or gray elves) are much paler, with alabaster skin sometimes tinged with blue. They often have hair of silver-white, black, or blue, but various shades of blond, brown, and red are not uncommon. Their eyes are blue or green and flecked with gold.</p>',
                      'ASI': [{ 'id': 4, 'bonus': 1 }],
                      'traits': [
                          {
                              'name': 'Elf Weapon Training',
                              'description': 'You have proficiency with the longsword, shortsword, shortbow, and longbow.'
                          },
                      {
                          'name': 'Cantrip',
                          'description': 'You know one cantrip of your choice from the wizard spell list. Intelligence is your spellcasting ability for it.'
                      },
                                            {
                                                'name': 'Extra Language',
                                                'description': 'You can speak, read, and write one extra language of your choice.'
                                            }
                      ],
                      'baseHeight': 54, //inches
                      'heightModifier': { 'qty': 2, 'die': 10 },
                      'baseWeight': 90, //lbs
                      'weightModifier': { 'qty': 1, 'die': 4 },
                  },
                  {
                      'id': 2,
                      'name': 'Wood Elf',
                      'description': '<p>As a wood elf, you have keen senses and intuition, and your fleet feet carry you quickly and stealthily through your native forests. This category includes the wild elves (grugach) of Greyhawk and the Kagonesti of Dragonlance, as well as the races called wood elves in Greyhawk and the Forgotten Realms. In Faerûn, wood elves (also called wild elves, green elves, or forest elves) are reclusive and distrusting of non-elves.</p><p>Wood elves’ skin tends to be copperish in hue, sometimes with traces of green. Their hair tends toward browns and blacks, but it is occasionally blond or copper-colored. Their eyes are green, brown, or hazel.</p>',
                      'ASI': [{ 'id': 5, 'bonus': 2 }],
                      'traits': [
                          {
                              'name': 'Elf Weapon Training',
                              'description': 'You have proficiency with the longsword, shortsword, shortbow, and longbow.'
                          },
                          {
                              'name': 'Fleet of Foot',
                              'description': 'Your base walking speed increases to 35 feet.'
                          },
                           {
                               'name': 'Mask of the Wild',
                               'description': 'You can attempt to hide even when you are only lightly obscured by foliage, heavy rain, falling snow, mist, and other natural phenomena.'
                           }
                      ],
                      'baseHeight': 54, //inches
                      'heightModifier': { 'qty': 2, 'die': 10 },
                      'baseWeight': 100, //lbs
                      'weightModifier': { 'qty': 1, 'die': 4 },
                  }
              ]
          },
          {
              'id': 3,
              'name': 'Halfling',
              'image': 'images/halfling.svg',
              'description': "The comforts of home are the goals of most halflings' lives: a place to settle in peace and quiet, far from marauding monsters and clashing armies; a blazing fire and a generous meal; fine drink and fine conversation. Though some halflings live out their days in remote agricultural communities, others form nomadic bands that travel constantly, lured by the open road and the wide horizon to discover the wonders of new lands and peoples. But even these wanderers love peace, food, hearth, and home, though home might be a wagon jostling along an dirt road or a raft floating downriver.",
              'ASI': [{ 'id': 2, 'bonus': 2 }],
              'age': 20,
              'ageDesc': "A halfling reaches adulthood at the age of 20 and generally lives into the middle of his or her second century.",
              'alignment': 'Lawful Good',
              'size': 'Small',
              'names': {
                  'male': ['Alton', 'Ander', 'Cade', 'Corrin', 'Eldon', 'Errich', 'Finnan', 'Garret', 'Lindal', 'Lyle', 'Merric', 'Milo', 'Osborn', 'Perrin', 'Reed', 'Roscoe', 'Wellby'],
                  'female': ['Andry', 'Bree', 'Callie', 'Cora', 'Euphemia', 'Jillian', 'Kithri', 'Lavinia', 'Lidda', 'Merla', 'Nedda', 'Paela', 'Portia', 'Seraphina', 'Shaena', 'Trym', 'Vani', 'Verna'],
                  'last': ['Brushgather', 'Goodbarrel', 'Greenbottle', 'High-hill', 'Hilltopple', 'Leagallow', 'Tealeaf', 'Thorngage', 'Tosscobble', 'Underbough']
              },
              'speed': 25,
              'traits': [
                { 'name': 'Lucky', 'description': 'When you roll a 1 on an attack roll, ability check, or saving throw, you can reroll the die and must use the new roll.' },
                { 'name': 'Brave', 'description': 'You have advantage on saving throws against being frightened.' },
                { 'name': 'Halfling Nimbleness', 'description': 'You can move through the space of any creature that is of a size larger than yours.' },
              ],
              'languages': [1, 7],
              'subrace': [
                  {
                      'id': 1,
                      'name': 'Lightfoot',
                      'description': '<p>As a lightfoot halfling, you can easily hide from notice, even using other people as cover. You’re inclined to be affable and get along well with others. In the Forgotten Realms, lightfoot halflings have spread the farthest and thus are the most common variety.</p><p>Lightfoots are more prone to wanderlust than other halflings, and often dwell alongside other races or take up a nomadic life. In the world of Greyhawk, these halflings are called hairfeet or tallfellows.</p>',
                      'ASI': [{ 'id': 6, 'bonus': 1 }],
                      'traits': [
                          {
                              'name': 'Naturally Stealthy',
                              'description': 'You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you.'
                          }
                      ],
                      'baseHeight': 31, //inches
                      'heightModifier': { 'qty': 2, 'die': 4 },
                      'baseWeight': 35, //lbs
                      'weightModifier': { 'qty': 1, 'die': 1 },
                  },
                  {
                      'id': 2,
                      'name': 'Stout',
                      'description': '<p>As a stout halfling, you’re hardier than average and have some resistance to poison. Some say that stouts have dwarven blood. In the Forgotten Realms, these halflings are called stronghearts, and they’re most common in the south.</p>',
                      'ASI': [{ 'id': 3, 'bonus': 1 }],
                      'traits': [
                          {
                              'name': 'Stout Resilience',
                              'description': 'You have advantage on saving throws against poison, and you have resistance against poison damage.'
                          }
                      ],
                      'baseHeight': 31, //inches
                      'heightModifier': { 'qty': 2, 'die': 4 },
                      'baseWeight': 35, //lbs
                      'weightModifier': { 'qty': 1, 'die': 1 },
                  }
              ]
          },
          {
              'id': 4,
              'name': 'Human',
              'image': 'images/human.svg',
              'description': "In the reckonings of most worlds, humans are the youngest of the common races, late to arrive on the world scene and short-lived in comparison to dwarves, elves, and dragons. Perhaps it is because of their shorter lives that they strive to achieve as much as they can in the years they are given. Or maybe they feel they have something to prove to the elder races, and that’s why they build their mighty empires on the foundation of conquest and trade. Whatever drives them, humans are the innovators, the achievers, and the pioneers of the worlds.",
              'ASI': [
                { 'id': 1, 'bonus': 1 },
                { 'id': 2, 'bonus': 1 },
                { 'id': 3, 'bonus': 1 },
                { 'id': 4, 'bonus': 1 },
                { 'id': 5, 'bonus': 1 },
                { 'id': 6, 'bonus': 1 }
              ],
              'age': 20,
              'ageDesc': "Humans reach adulthood in their late teens and live less than a century.",
              'alignment': '',
              'size': 'Medium',
              'names': {
                  'male': ['Darvin', 'Dorn', 'Evendur', 'Gorstag', 'Grim', 'Helm', 'Malark', 'Morn', 'Randal', 'Stedd', 'Bor', 'Fodel', 'Glar', 'Grigor', 'Igan', 'Ivor', 'Kosef', 'Mival', 'Orel', 'Pavel', 'Sergor', 'Ander', 'Blath', 'Bran', 'Frath', 'Geth', 'Lander', 'Luth', 'Malcer', 'Stor', 'Taman', 'Urth'],
                  'female': ['Alethra', 'Kara', 'Katernin', 'Mara', 'Natali', 'Olma', 'Tana', 'Zora', 'Amafrey', 'Betha', 'Cefrey', 'Kethra', 'Mara', 'Olga', 'Silifrey', 'Westra', 'Arizima', 'Chathi', 'Nephis', 'Nulara', 'Murithi', 'Sefris', 'Thola', 'Umara', 'Zolis'],
                  'last': ['Amblecrown', 'Buckman', 'Dundragon', 'Evenwood', 'Greycastle', 'Tallstag', 'Bersk', 'Chernin', 'Dotsk', 'Kulenov', 'Marsk', 'Nemetsk', 'Shemov', 'Starag', 'Brightwood', 'Helder', 'Hornraven', 'Lackman', 'Stormwind', 'Windrivver']
              },
              'speed': 30,
              'traits': [
              ],
              'languages': [1, 9],
              'subrace': [
                  {
                      'id': 1,
                      'name': 'None',
                      'description': null,
                      'ASI': [],
                      'traits': [],
                      'baseHeight': 56, //inches
                      'heightModifier': { 'qty': 2, 'die': 10 },
                      'baseWeight': 110, //lbs
                      'weightModifier': { 'qty': 2, 'die': 4 },
                  },
                  {
                      'id': 2,
                      'name': 'Variant',
                      'description': null,
                      'ASI': [],
                      'traits': [],
                      'baseHeight': 56, //inches
                      'heightModifier': { 'qty': 2, 'die': 10 },
                      'baseWeight': 110, //lbs
                      'weightModifier': { 'qty': 2, 'die': 4 },
                  }
              ]
          }
            ];
        },
        AbilityScores: function () {
            return [
                { "id": 1, "name": "Strength", "description": "Strength measures bodily power, athletic training, and the extent to which you can exert raw physical force." },
                { "id": 2, "name": "Dexterity", "description": "Dexterity measures agility, reflexes, and balance." },
                { "id": 3, "name": "Constitution", "description": "Constitution measures health, stamina, and vital force." },
                { "id": 4, "name": "Intelligence", "description": "Intelligence measures mental acuity, accuracy of recall, and the ability to reason." },
                { "id": 5, "name": "Wisdom", "description": "Wisdom reflects how attuned you are to the world around you and represents perceptiveness and intuition." },
                { "id": 6, "name": "Charisma", "description": "Charisma measures your ability to interact effectively with others. It includes such factors as confidence and eloquence, and it can represent a charming or commanding personality." }
            ];
        },
        Alignment: function () {
            return [
                {
                    "id": 1,
                    "name": "Lawful good",
                    "short": "LG",
                    "description":"Lawful good (LG) creatures can be counted on to do the right thing as expected by society. Gold dragons, paladins, and most dwarves are lawful good."
                },
                {
                    "id": 2,
                    "name": "Neutral good",
                    "short": "NG",
                    "description": "Neutral good (NG) folk do the best they can to help others according to their needs. Many celestials, some cloud giants, and most gnomes are neutral good."
                },
                {
                    "id": 3,
                    "name": "Chaotic good",
                    "short": "CG",
                    "description": "Chaotic good (CG) creatures act as their conscience directs, with little regard for what others expect. Copper dragons, many elves, and unicorns are chaotic good."
                },
                {
                    "id": 4,
                    "name": "Lawful neutral",
                    "short": "LN",
                    "description": "Lawful neutral (LN) individuals act in accordance with law, tradition, or personal codes. Many monks and some wizards are lawful neutral."
                },
                {
                    "id": 5,
                    "name": "Neutral",
                    "short": "N",
                    "description": "Neutral (N) is the alignment of those who prefer to steer clear of moral questions and don’t take sides, doing what seems best at the time. Lizardfolk, most druids, and many humans are neutral."
                },
                {
                    "id": 6,
                    "name": "Chaotic neutral",
                    "short": "CN",
                    "description": "Chaotic neutral (CN) creatures follow their whims, holding their personal freedom above all else. Many barbarians and rogues, and some bards, are chaotic neutral."
                },
                {
                    "id": 7,
                    "name": "Lawful evil",
                    "short": "LE",
                    "description": "Lawful evil (LE) creatures methodically take what they want, within the limits of a code of tradition, loyalty, or order. Devils, blue dragons, and hobgoblins are lawful evil."
                },
                {
                    "id": 8,
                    "name": "Neutral evil",
                    "short": "NE",
                    "description": "Neutral evil (NE) is the alignment of those who do whatever they can get away with, without compassion or qualms. Many drow, some cloud giants, and yugoloths are neutral evil."
                },
                {
                    "id": 9,
                    "name": "Chaotic evil",
                    "short": "CE",
                    "description": "Chaotic evil (CE) creatures act with arbitrary violence, spurred by their greed, hatred, or bloodlust. Demons, red dragons, and orcs are chaotic evil."
                },
            ];
        },
        Skills: function () {
            return [
                { "id": 1, "abilityID": 1, "name": "Athletics", "description": "Your Strength (Athletics) check covers difficult situations you encounter while climbing, jumping, or swimming." },
                { "id": 2, "abilityID": 2, "name": "Acrobatics", "description": "Your Dexterity (Acrobatics) check covers your attempt to stay on your feet in a tricky situation, such as when you’re trying to run across a sheet of ice, balance on a tightrope, or stay upright on a rocking ship’s deck. The DM might also call for a Dexterity (Acrobatics) check to see if you can perform acrobatic stunts, including dives, rolls, somersaults, and flips." },
                { "id": 3, "abilityID": 2, "name": "Sleight of Hand", "description": "Whenever you attempt an act of legerdemain or manual trickery, such as planting something on someone else or concealing an object on your person, make a Dexterity (Sleight of Hand) check. The DM might also call for a Dexterity (Sleight of Hand) check to determine whether you can lift a coin purse off another person or slip something out of another person’s pocket." },
                { "id": 4, "abilityID": 2, "name": "Stealth", "description": "Make a Dexterity (Stealth) check when you attempt to conceal yourself from enemies, slink past guards, slip away without being noticed, or sneak up on someone without being seen or heard." },
                { "id": 5, "abilityID": 4, "name": "Arcana", "description": "Your Intelligence (Arcana) check measures your ability to recall lore about spells, magic items, eldritch symbols, magical traditions, the planes of existence, and the inhabitants of those planes." },
                { "id": 6, "abilityID": 4, "name": "History", "description": "Your Intelligence (History) check measures your ability to recall lore about historical events, legendary people, ancient kingdoms, past disputes, recent wars, and lost civilizations." },
                { "id": 7, "abilityID": 4, "name": "Investigation", "description": "When you look around for clues and make deductions based on those clues, you make an Intelligence (Investigation) check. You might deduce the location of a hidden object, discern from the appearance of a wound what kind of weapon dealt it, or determine the weakest point in a tunnel that could cause it to collapse. Poring through ancient scrolls in search of a hidden fragment of knowledge might also call for an Intelligence (Investigation) check." },
                { "id": 8, "abilityID": 4, "name": "Nature", "description": "Your Intelligence (Nature) check measures your ability to recall lore about terrain, plants and animals, the weather, and natural cycles." },
                { "id": 9, "abilityID": 4, "name": "Religion", "description": "Your Intelligence (Religion) check measures your ability to recall lore about deities, rites and prayers, religious hierarchies, holy symbols, and the practices of secret cults." },
                { "id": 10, "abilityID": 5, "name": "Animal Handling", "description": "When there is any question whether you can calm down a domesticated animal, keep a mount from getting spooked, or intuit an animal’s intentions, the DM might call for a Wisdom (Animal Handling) check. You also make a Wisdom (Animal Handling) check to control your mount when you attempt a risky maneuver." },
                { "id": 11, "abilityID": 5, "name": "Insight", "description": "Your Wisdom (Insight) check decides whether you can determine the true intentions of a creature, such as when searching out a lie or predicting someone’s next move. Doing so involves gleaning clues from body language, speech habits, and changes in mannerisms." },
                { "id": 12, "abilityID": 5, "name": "Medicine", "description": "A Wisdom (Medicine) check lets you try to stabilize a dying companion or diagnose an illness." },
                { "id": 13, "abilityID": 5, "name": "Perception", "description": "Your Wisdom (Perception) check lets you spot, hear, or otherwise detect the presence of something. It measures your general awareness of your surroundings and the keenness of your senses. For example, you might try to hear a conversation through a closed door, eavesdrop under an open window, or hear monsters moving stealthily in the forest. Or you might try to spot things that are obscured or easy to miss, whether they are orcs lying in ambush on a road, thugs hiding in the shadows of an alley, or candlelight under a closed secret door." },
                { "id": 14, "abilityID": 5, "name": "Survival", "description": "The DM might ask you to make a Wisdom (Survival) check to follow tracks, hunt wild game, guide your group through frozen wastelands, identify signs that owlbears live nearby, predict the weather, or avoid quicksand and other natural hazards." },
                { "id": 15, "abilityID": 6, "name": "Deception", "description": "Your Charisma (Deception) check determines whether you can convincingly hide the truth, either verbally or through your actions. This deception can encompass everything from misleading others through ambiguity to telling outright lies. Typical situations include trying to fast-talk a guard, con a merchant, earn money through gambling, pass yourself off in a disguise, dull someone’s suspicions with false assurances, or maintain a straight face while telling a blatant lie." },
                { "id": 16, "abilityID": 6, "name": "Intimidation", "description": "When you attempt to influence someone through overt threats, hostile actions, and physical violence, the DM might ask you to make a Charisma (Intimidation) check. Examples include trying to pry information out of a prisoner, convincing street thugs to back down from a confrontation, or using the edge of a broken bottle to convince a sneering vizier to reconsider a decision." },
                { "id": 17, "abilityID": 6, "name": "Performance", "description": "Your Charisma (Performance) check determines how well you can delight an audience with music, dance, acting, storytelling, or some other form of entertainment." },
                { "id": 18, "abilityID": 6, "name": "Persuasion", "description": "When you attempt to influence someone or a group of people with tact, social graces, or good nature, the DM might ask you to make a Charisma (Persuasion) check. Typically, you use persuasion when acting in good faith, to foster friendships, make cordial requests, or exhibit proper etiquette. Examples of persuading others include convincing a chamberlain to let your party see the king, negotiating peace between warring tribes, or inspiring a crowd of townsfolk." }
            ];
        },
        Classes: function () {
            return [
 {
     "id": 1,
     "Name": "Cleric",
     "Description": "Clerics are intermediaries between the mortal world and the distant planes of the gods. As varied as the gods they serve, clerics strive to embody the handiwork of their deities. No ordinary priest, a cleric is imbued with divine magic.",
     "HitDie": 8,
     "PrimaryAbility": 5,
     "SavingThrowProficiencies": [4, 6],
     "EquipmentTypeProficiencies": [1, 2, 4, 5, 6],
     "ArmorProficiencies": [],
     "WeaponProficiencies": [],
     "ToolProficiencies": [],
     "StartingWealth": { "DieCount": 5, "Die": 4, "Multiplier": 10 },
     "StartingEquip": [
         [[{ "Type": "Weapon", "id": 7, "ifProficient": false, "qty": 1 }], [{ "Type": "Weapon", "id": 32, "ifProficient": true, "qty": 1 }]],
         [[{ "Type": "Armor", "id": 6, "ifProficient": false, "qty": 1 }], [{ "Type": "Armor", "id": 2, "ifProficient": false, "qty": 1 }], [{ "Type": "Armor", "id": 5, "ifProficient": true, "qty": 1 }]],
         [[{ "Type": "Weapon", "id": 12, "ifProficient": false, "qty": 1 }, { "Type": "Gear", "id": 6, "ifProficient": false, "qty": 1 }], [{ "Type": "Equipment", "id": 5, "ifProficient": false, "qty": 1 }], [{ "Type": "Equipment", "id": 6, "ifProficient": false, "qty": 1 }]],
         [[{ "Type": "Pack", "id": 6, "ifProficient": false, "qty": 1 }], [{ "Type": "Pack", "id": 5, "ifProficient": false, "qty": 1 }]],
         [[{ "Type": "Armor", "id": 13, "ifProficient": false, "qty": 1 }]],
         [[{ "Type": "Category", "id": 4, "ifProficient": false, "qty": 1 }]],
     ],
     "Skills": { "HowMany": 2, "Choices": [6, 11, 12, 18, 9] },
     "Icon": "images/cleric.svg",
     "AbilitySuggestion": "First, Wisdom should be your highest ability score, followed by Strength or Constitution.",
     "BackgroundSuggestion": "Choose the acolyte background.",
     "SpellSuggestion": ""

 },
 {
     "id": 2,
     "Name": "Fighter",
     "Description": "Questing knights, conquering overlords, royal champions, elite foot soldiers, hardened mercenaries, and bandit kings — as fighters, they all share an unparalleled mastery with weapons and armor, and a thorough knowledge of the skills of combat. And they are well acquainted with death, both meting it out and staring it defiantly in the face.",
     "HitDie": 10,
     "PrimaryAbility": [1, 2],
     "SavingThrowProficiencies": [1, 3],
     "EquipmentTypeProficiencies": [1, 2, 3, 4, 5, 6, 7, 8],
     "ArmorProficiencies": [],
     "WeaponProficiencies": [],
     "ToolProficiencies": [],
     "StartingWealth": { "DieCount": 5, "Die": 4, "Multiplier": 10 },
     "StartingEquip": [
         [[{ "Type": "Armor", "id": 10, "ifProficient": false, "qty": 1 }], [{ "Type": "Armor", "id": 2, "ifProficient": false, "qty": 1 }, { "Type": "Weapon", "id": 37, "ifProficient": false, "qty": 1 }, { "Type": "Gear", "id": 4, "ifProficient": false, "qty": 1 }]],
         [[{ "Type": "Equipment", "id": 6, "ifProficient": false, "qty": 1 }], [{ "Type": "Armor", "id": 2, "ifProficient": false, "qty": 1 }], [{ "Type": "Armor", "id": 5, "ifProficient": true, "qty": 1 }]],
         [[{ "Type": "Weapon", "id": 12, "ifProficient": false, "qty": 1 }, { "Type": "Gear", "id": 6, "ifProficient": false, "qty": 1 }], [{ "Type": "Equipment", "id": 9, "ifProficient": false, "qty": 1 }]],
         [[{ "Type": "Pack", "id": 6, "ifProficient": false, "qty": 1 }], [{ "Type": "Pack", "id": 5, "ifProficient": false, "qty": 1 }]],
         [[{ "Type": "Armor", "id": 13, "ifProficient": false, "qty": 1 }]],
         [[{ "Type": "Category", "id": 4, "ifProficient": false, "qty": 1 }]],
     ],
     "Skills": { "HowMany": 2, "Choices": [2, 10, 1, 6, 11, 16, 13, 14] },
     "Icon": "images/fighter.svg",
     "AbilitySuggestion": "First, make Strength or Dexterity your highest ability score, depending on whether you want to focus on melee weapons or on archery (or finesse weapons). Your next-highest score should be Constitution.",
     "BackgroundSuggestion": "Choose the soldier background.",
     "SpellSuggestion": ""
 },
 {
     "id": 3,
     "Name": "Rogue",
     "Description": "Rogues rely on skill, stealth, and their foes’ vulnerabilities to get the upper hand in any situation. They have a knack for finding the solution to just about any problem, demonstrating a resourcefulness and versatility that is the cornerstone of any successful adventuring party.",
     "HitDie": 8,
     "PrimaryAbility": [2],
     "SavingThrowProficiencies": [2, 4],
     "EquipmentTypeProficiencies": [1, 5, 6],
     "ArmorProficiencies": [],
     "WeaponProficiencies": [35, 23, 27, 29],
     "ToolProficiencies": [],
     "StartingWealth": { "DieCount": 4, "Die": 4, "Multiplier": 10 },
     "StartingEquip": [],
     "Skills": { "HowMany": 4, "Choices": [2, 1, 15, 11, 16, 7, 13, 17, 3, 4] },
     "Icon": "images/rogue.svg",
     "AbilitySuggestion": "First, Dexterity should be your highest ability score. Make Intelligence your next-highest if you want to excel at Investigation. Choose Charisma instead if you plan to emphasize deception and social interaction.",
     "BackgroundSuggestion": "Choose the criminal background.",
     "SpellSuggestion": ""
 },
 {
     "id": 4,
     "Name": "Wizard",
     "Description": "Wizards are supreme magic-users, defined and united as a class by the spells they cast. Drawing on the subtle weave of magic that permeates the cosmos, wizards cast spells of explosive fire, arcing lightning, subtle deception, and brute-force mind control. Their magic conjures monsters from other planes of existence, glimpses the future, or turns slain foes into zombies. Their mightiest spells change one substance into another, call meteors down from the sky, or open portals to other worlds.",
     "HitDie": 6,
     "PrimaryAbility": [4],
     "SavingThrowProficiencies": [4, 5],
     "EquipmentTypeProficiencies": [],
     "ArmorProficiencies": [],
     "WeaponProficiencies": [2, 13, 15, 8, 12],
     "ToolProficiencies": [37],
     "StartingWealth": { "DieCount": 4, "Die": 4, "Multiplier": 10 },
     "StartingEquip": [],
     "Skills": { "HowMany": 2, "Choices": [5, 6, 11, 7, 12, 9] },
     "Icon": "images/wizard.svg",
     "AbilitySuggestion": "First, Intelligence should be your highest ability score, followed by Constitution or Dexterity.",
     "BackgroundSuggestion": "Choose the sage background.",
     "SpellSuggestion": "Choose the light, mage hand, and ray of frost cantrips, along with the following 1st-level spells for your spellbook: burning hands, charm person, mage armor, magic missile, shield, and sleep."
 }
            ];
        },
        EquipmentType: function () {
            return [
                { "id": 1, "name": "Light Armor", "don": "1 minute", "doff": "1 minute" },
                { "id": 2, "name": "Medium Armor", "don": "5 minutes", "doff": "1 minute" },
                { "id": 3, "name": "Heavy Armor", "don": "10 minutes", "doff": "5 minute" },
                { "id": 4, "name": "Shield", "don": "1 action", "doff": "1 action" },
                { "id": 5, "name": "Simple Melee Weapons", "don": "", "doff": "" },
                { "id": 6, "name": "Simple Ranged Weapons", "don": "", "doff": "" },
                { "id": 7, "name": "Martial Melee Weapons", "don": "", "doff": "" },
                { "id": 8, "name": "Martial Ranged Weapons", "don": "", "doff": "" },
                // the next two are special: used to represent the groups of melee/ranged for 5-8 above
                { "id": 9, "name": "Simple Weapons", "don": "", "doff": "" },
                { "id": 10, "name": "Martial Weapons", "don": "", "doff": "" },
            ];
        },
        Armor: function () {
            return [
  {
      "id": 1,
      "typeID": 1,
      "name": "Padded",
      "cost": 500,
      "armorClass": "11 + Dex modifier",
      "strength": null,
      "stealth": "Disadvantage",
      "weight": "8 lb."
  },
  {
      "id": 2,
      "typeID": 1,
      "name": "Leather",
      "cost": 1000,
      "armorClass": "11 + Dex modifier",
      "strength": null,
      "stealth": null,
      "weight": "10 lb."
  },
  {
      "id": 3,
      "typeID": 1,
      "name": "Studded leather",
      "cost": 4500,
      "armorClass": "12 + Dex modifier",
      "strength": null,
      "stealth": null,
      "weight": "13 lb."
  },
  {
      "id": 4,
      "typeID": 2,
      "name": "Hide",
      "cost": 1000,
      "armorClass": "12 + Dex modifier (max 2)",
      "strength": null,
      "stealth": null,
      "weight": "12 lb."
  },
  {
      "id": 5,
      "typeID": 2,
      "name": "Chain shirt",
      "cost": 5000,
      "armorClass": "13 + Dex modifier (max 2)",
      "strength": null,
      "stealth": null,
      "weight": "20 lb."
  },
  {
      "id": 6,
      "typeID": 2,
      "name": "Scale mail",
      "cost": 5000,
      "armorClass": "14 + Dex modifier (max 2)",
      "strength": null,
      "stealth": "Disadvantage",
      "weight": "45 lb."
  },
  {
      "id": 7,
      "typeID": 2,
      "name": "Breastplate",
      "cost": 40000,
      "armorClass": "14 + Dex modifier (max 2)",
      "strength": null,
      "stealth": null,
      "weight": "20 lb."
  },
  {
      "id": 8,
      "typeID": 2,
      "name": "Half plate",
      "cost": 75000,
      "armorClass": "15 + Dex modifier (max 2)",
      "strength": null,
      "stealth": "Disadvantage",
      "weight": "40 lb."
  },
  {
      "id": 9,
      "typeID": 3,
      "name": "Ring mail",
      "cost": 3000,
      "armorClass": "14",
      "strength": null,
      "stealth": "Disadvantage",
      "weight": "40 lb."
  },
  {
      "id": 10,
      "typeID": 3,
      "name": "Chain mail",
      "cost": 7500,
      "armorClass": "16",
      "strength": 13,
      "stealth": "Disadvantage",
      "weight": "55 lb."
  },
  {
      "id": 11,
      "typeID": 3,
      "name": "Splint",
      "cost": 20000,
      "armorClass": "17",
      "strength": 15,
      "stealth": "Disadvantage",
      "weight": "60 lb."
  },
  {
      "id": 12,
      "typeID": 3,
      "name": "Plate",
      "cost": 150000,
      "armorClass": "18",
      "strength": 15,
      "stealth": "Disadvantage",
      "weight": "65 lb."
  },
  {
      "id": 13,
      "typeID": 4,
      "name": "Shield",
      "cost": 1000,
      "armorClass": 2,
      "strength": null,
      "stealth": null,
      "weight": "6 lb."
  }
            ];
        },
        Weapons: function () {
            return [
  {
      "id": 1,
      "typeID": [5,9],
      "name": "Club",
      "cost": 10,
      "damage": "1d4 bludgeoning",
      "weight": "2 lb.",
      "properties": ["Light"],
      "Versatile": null,
      "normalrange": 5,
      "longrange": 5
  },
  {
      "id": 2,
      "typeID": [5,9],
      "name": "Dagger",
      "cost": 200,
      "damage": "1d4 piercing",
      "weight": "1 lb.",
      "properties": ["Finesse", "Light", "Thrown"],
      "Versatile": null,
      "normalrange": 20,
      "longrange": 60
  },
  {
      "id": 3,
      "typeID": [5,9],
      "name": "Greatclub",
      "cost": 20,
      "damage": "1d8 bludgeoning",
      "weight": "10 lb.",
      "properties": ["Two-handed"],
      "Versatile": null,
      "normalrange": 5,
      "longrange": 5
  },
  {
      "id": 4,
      "typeID": [5,9],
      "name": "Handaxe",
      "cost": 500,
      "damage": "1d6 slashing",
      "weight": "2 lb.",
      "properties": ["Light", "Thrown"],
      "Versatile": null,
      "normalrange": 20,
      "longrange": 60
  },
  {
      "id": 5,
      "typeID": [5,9],
      "name": "Javelin",
      "cost": 50,
      "damage": "1d6 piercing",
      "weight": "2 lb.",
      "properties": ["Thrown"],
      "Versatile": null,
      "normalrange": 30,
      "longrange": 120

  },
  {
      "id": 6,
      "typeID": [5,9],
      "name": "Light hammer",
      "cost": 200,
      "damage": "1d4 bludgeoning",
      "weight": "2 lb.",
      "properties": ["Light", "Thrown"],
      "Versatile": null,
      "normalrange": 20,
      "longrange": 60
  },
  {
      "id": 7,
      "typeID": [5,9],
      "name": "Mace",
      "cost": 500,
      "damage": "1d6 bludgeoning",
      "weight": "4 lb.",
      "properties": [],
      "Versatile": null,
      "normalrange": 5,
      "longrange": 5
  },
  {
      "id": 8,
      "typeID": [5,9],
      "name": "Quarterstaff",
      "cost": 20,
      "damage": "1d6 bludgeoning",
      "weight": "4 lb.",
      "properties": ["Versatile"],
      "Versatile": "1d8",
      "normalrange": 5,
      "longrange": 5
  },
  {
      "id": 9,
      "typeID": [5,9],
      "name": "Sickle",
      "cost": 100,
      "damage": "1d4 slashing",
      "weight": "2 lb.",
      "properties": ["Light"],
      "Versatile": null,
      "normalrange": 5,
      "longrange": 5
  },
  {
      "id": 10,
      "typeID": [5,9],
      "name": "Spear",
      "cost": 100,
      "damage": "1d6 piercing",
      "weight": "3 lb.",
      "properties": ["Thrown", "Versatile"],
      "Versatile": "1d8",
      "normalrange": 20,
      "longrange": 60
  },
  {
      "id": 11,
      "typeID": [5,9],
      "name": "Unarmed strike",
      "cost": null,
      "damage": "1 bludgeoning",
      "weight": null,
      "properties": [],
      "Versatile": null,
      "normalrange": 5,
      "longrange": 5
  },
  {
      "id": 12,
      "typeID": [6,9],
      "name": "Light Crossbow",
      "cost": 2500,
      "damage": "1d8 piercing",
      "weight": "5 lb.",
      "properties": ["Ammunition", "Loading", "Two-handed"],
      "Versatile": null,
      "normalrange": 80,
      "longrange": 320
  },
  {
      "id": 13,
      "typeID": [6,9],
      "name": "Dart",
      "cost": 5,
      "damage": "1d4 piercing",
      "weight": "1/4 lb.",
      "properties": ["Finesse", "Thrown"],
      "Versatile": null,
      "normalrange": 20,
      "longrange": 60
  },
  {
      "id": 14,
      "typeID": [6,9],
      "name": "Shortbow",
      "cost": 2500,
      "damage": "1d6 piercing",
      "weight": "2 lb.",
      "properties": ["Ammunition", "Two-handed"],
      "Versatile": null,
      "normalrange": 80,
      "longrange": 320
  },
  {
      "id": 15,
      "typeID": [6,9],
      "name": "Sling",
      "cost": 10,
      "damage": "1d4 bludgeoning",
      "weight": null,
      "properties": ["Ammunition"],
      "Versatile": null,
      "normalrange": 30,
      "longrange": 120
  },
  {
      "id": 16,
      "typeID": [7,10],
      "name": "Battleaxe",
      "cost": 1000,
      "damage": "1d8 slashing",
      "weight": "4 lb.",
      "properties": ["Versatile"],
      "Versatile": "1d10",
      "normalrange": 5,
      "longrange": 5
  },
  {
      "id": 17,
      "typeID": [7,10],
      "name": "Flail",
      "cost": 1000,
      "damage": "1d8 bludgeoning",
      "weight": "2 lb.",
      "properties": [],
      "Versatile": null,
      "normalrange": 5,
      "longrange": 5
  },
  {
      "id": 18,
      "typeID": [7,10],
      "name": "Glaive",
      "cost": 2000,
      "damage": "1d10 slashing",
      "weight": "6 lb.",
      "properties": ["Heavy", "Reach", "Two-handed"],
      "Versatile": null,
      "normalrange": 10,
      "longrange": 10
  },
  {
      "id": 19,
      "typeID": [7,10],
      "name": "Greataxe",
      "cost": 3000,
      "damage": "1d12 slashing",
      "weight": "7 lb.",
      "properties": ["Heavy", "Two-handed"],
      "Versatile": null,
      "normalrange": 5,
      "longrange": 5
  },
  {
      "id": 20,
      "typeID": [7,10],
      "name": "Greatsword",
      "cost": 5000,
      "damage": "2d6 slashing",
      "weight": "6 lb.",
      "properties": ["Heavy", "Two-handed"],
      "Versatile": null,
      "normalrange": 5,
      "longrange": 5
  },
  {
      "id": 21,
      "typeID": [7,10],
      "name": "Halberd",
      "cost": 2000,
      "damage": "1d10 slashing",
      "weight": "6 lb.",
      "properties": ["Heavy", "Reach", "Two-handed"],
      "Versatile": null,
      "normalrange": 10,
      "longrange": 10
  },
  {
      "id": 22,
      "typeID": [7,10],
      "name": "Lance",
      "cost": 1000,
      "damage": "1d12 piercing",
      "weight": "6 lb.",
      "properties": ["Reach", "Special"],
      "Versatile": null,
      "normalrange": 5,
      "longrange": 10
  },
  {
      "id": 23,
      "typeID": [7,10],
      "name": "Longsword",
      "cost": 1500,
      "damage": "1d8 slashing",
      "weight": "3 lb.",
      "properties": ["Versatile"],
      "Versatile": "1d10",
      "normalrange": 5,
      "longrange": 5
  },
  {
      "id": 24,
      "typeID": [7,10],
      "name": "Maul",
      "cost": 1000,
      "damage": "2d6 bludgeoning",
      "weight": "10 lb.",
      "properties": ["Heavy", "Two-handed"],
      "Versatile": null,
      "normalrange": 5,
      "longrange": 5
  },
  {
      "id": 25,
      "typeID": [7,10],
      "name": "Morningstar",
      "cost": 1500,
      "damage": "1d8 piercing",
      "weight": "4 lb.",
      "properties": [],
      "Versatile": null,
      "normalrange": 5,
      "longrange": 5
  },
  {
      "id": 26,
      "typeID": [7,10],
      "name": "Pike",
      "cost": 500,
      "damage": "1d10 piercing",
      "weight": "18 lb.",
      "properties": ["Heavy", "Reach", "Two-handed"],
      "Versatile": null,
      "normalrange": 10,
      "longrange": 10
  },
  {
      "id": 27,
      "typeID": [7,10],
      "name": "Rapier",
      "cost": 2500,
      "damage": "1d8 piercing",
      "weight": "2 lb.",
      "properties": ["Finesse"],
      "Versatile": null,
      "normalrange": 5,
      "longrange": 5
  },
  {
      "id": 28,
      "typeID": [7,10],
      "name": "Scimitar",
      "cost": 2500,
      "damage": "1d6 slashing",
      "weight": "3 lb.",
      "properties": ["Finesse", "Light"],
      "Versatile": null,
      "normalrange": 5,
      "longrange": 5
  },
  {
      "id": 29,
      "typeID": [7,10],
      "name": "Shortsword",
      "cost": 1000,
      "damage": "1d6 piercing",
      "weight": "2 lb.",
      "properties": ["Finesse", "Light"],
      "Versatile": null,
      "normalrange": 5,
      "longrange": 5
  },
  {
      "id": 30,
      "typeID": [7,10],
      "name": "Trident",
      "cost": 500,
      "damage": "1d6 piercing",
      "weight": "4 lb.",
      "properties": ["Thrown", "Versatile"],
      "Versatile": "1d8",
      "normalrange": 20,
      "longrange": 60
  },
  {
      "id": 31,
      "typeID": [7,10],
      "name": "War pick",
      "cost": 500,
      "damage": "1d8 piercing",
      "weight": "2 lb.",
      "properties": [],
      "Versatile": null,
      "normalrange": 5,
      "longrange": 5
  },
  {
      "id": 32,
      "typeID": [7,10],
      "name": "Warhammer",
      "cost": 1500,
      "damage": "1d8 bludgeoning",
      "weight": "2 lb.",
      "properties": ["Versatile"],
      "Versatile": "1d10",
      "normalrange": 5,
      "longrange": 5
  },
  {
      "id": 33,
      "typeID": [7,10],
      "name": "Whip",
      "cost": 200,
      "damage": "1d4 slashing",
      "weight": "3 lb.",
      "properties": ["Finesse", "Reach"],
      "Versatile": null,
      "normalrange": 10,
      "longrange": 10
  },
  {
      "id": 34,
      "typeID": [8,10],
      "name": "Blowgun",
      "cost": 1000,
      "damage": "1 piercing",
      "weight": "1 lb.",
      "properties": ["Ammunition", "Loading"],
      "Versatile": null,
      "normalrange": 25,
      "longrange": 100
  },
  {
      "id": 35,
      "typeID": [8,10],
      "name": "Hand Crossbow",
      "cost": 7500,
      "damage": "1d6 piercing",
      "weight": "3 lb.",
      "properties": ["Ammunition", "Light", "Loading"],
      "Versatile": null,
      "normalrange": 30,
      "longrange": 120
  },
  {
      "id": 36,
      "typeID": [8,10],
      "name": "Heavy Crossbow",
      "cost": 5000,
      "damage": "1d10 piercing",
      "weight": "18 lb.",
      "properties": ["Ammunition", "Heavy", "Loading", "Two-handed"],
      "Versatile": null,
      "normalrange": 100,
      "longrange": 400
  },
  {
      "id": 37,
      "typeID": [8,10],
      "name": "Longbow",
      "cost": 5000,
      "damage": "1d8 piercing",
      "weight": "2 lb.",
      "properties": ["Ammunition", "Heavy", "Two-handed"],
      "Versatile": null,
      "normalrange": 150,
      "longrange": 600
  },
  {
      "id": 38,
      "typeID": [8,10],
      "name": "Net",
      "cost": 100,
      "damage": null,
      "weight": "3 lb.",
      "properties": ["Special", "Thrown"],
      "Versatile": null,
      "normalrange": 5,
      "longrange": 15
  }
            ];
        },
        ItemCategory: function () {
            return [
                 { "id": 1, "name": "Ammunition" },
                 { "id": 2, "name": "Arcane focus" },
                 { "id": 3, "name": "Druidic focus" },
                 { "id": 4, "name": "Holy symbol" },
                 { "id": 5, "name": "Containers" },
                { "id": 6, "name": "Artisan’s tools" },
                { "id": 7, "name": "Gaming set" },
                { "id": 8, "name": "Musical instrument" },
                { "id": 9, "name": "Vehicle" },
                { "id": 10, "name": "Trade Goods" },
                { "id": 11, "name": "Unlisted" },
            ];
        },
        Tools: function () {
            return [
  {
      "id": 1,
      "name": "Alchemist’s supplies",
      "cost": 5000,
      "Weight": "8 lb.",
      "CategoryID": 6
  },
  {
      "id": 2,
      "name": "Brewer’s supplies",
      "cost": 2000,
      "Weight": "9 lb.",
      "CategoryID": 6
  },
  {
      "id": 3,
      "name": "Calligrapher's supplies",
      "cost": 1000,
      "Weight": "5 lb.",
      "CategoryID": 6
  },
  {
      "id": 4,
      "name": "Carpenter’s tools",
      "cost": 800,
      "Weight": "6 lb.",
      "CategoryID": 6
  },
  {
      "id": 5,
      "name": "Cartographer’s tools",
      "cost": 1500,
      "Weight": "6 lb.",
      "CategoryID": 6
  },
  {
      "id": 6,
      "name": "Cobbler’s tools",
      "cost": 500,
      "Weight": "5 lb.",
      "CategoryID": 6
  },
  {
      "id": 7,
      "name": "Cook’s utensils",
      "cost": 100,
      "Weight": "8 lb.",
      "CategoryID": 6
  },
  {
      "id": 8,
      "name": "Glassblower’s tools",
      "cost": 3000,
      "Weight": "5 lb.",
      "CategoryID": 6
  },
  {
      "id": 9,
      "name": "Jeweler’s tools",
      "cost": 2500,
      "Weight": "2 lb.",
      "CategoryID": 6
  },
  {
      "id": 10,
      "name": "Leatherworker’s tools",
      "cost": 500,
      "Weight": "5 lb.",
      "CategoryID": 6
  },
  {
      "id": 11,
      "name": "Mason’s tools",
      "cost": 1000,
      "Weight": "8 lb.",
      "CategoryID": 6
  },
  {
      "id": 12,
      "name": "Painter’s supplies",
      "cost": 1000,
      "Weight": "5 lb.",
      "CategoryID": 6
  },
  {
      "id": 13,
      "name": "Potter’s tools",
      "cost": 1000,
      "Weight": "3 lb.",
      "CategoryID": 6
  },
  {
      "id": 14,
      "name": "Smith’s tools",
      "cost": 2000,
      "Weight": "8 lb.",
      "CategoryID": 6
  },
  {
      "id": 15,
      "name": "Tinker’s tools",
      "cost": 5000,
      "Weight": "10 lb.",
      "CategoryID": 6
  },
  {
      "id": 16,
      "name": "Weaver’s tools",
      "cost": 100,
      "Weight": "5 lb.",
      "CategoryID": 6
  },
  {
      "id": 17,
      "name": "Woodcarver’s tools",
      "cost": 100,
      "Weight": "5 lb.",
      "CategoryID": 6
  },
  {
      "id": 18,
      "name": "Disguise kit",
      "cost": 2500,
      "Weight": "3 lb.",
      "CategoryID": null
  },
  {
      "id": 19,
      "name": "Forgery kit",
      "cost": 1500,
      "Weight": "5 lb.",
      "CategoryID": null
  },
  {
      "id": 20,
      "name": "Dice set",
      "cost": 10,
      "Weight": null,
      "CategoryID": 7
  },
  {
      "id": 21,
      "name": "Dragonchess set",
      "cost": 100,
      "Weight": "1/2 lb.",
      "CategoryID": 7
  },
  {
      "id": 22,
      "name": "Playing card set",
      "cost": 50,
      "Weight": null,
      "CategoryID": 7
  },
  {
      "id": 23,
      "name": "Three-Dragon Ante set",
      "cost": 100,
      "Weight": null,
      "CategoryID": 7
  },
  {
      "id": 24,
      "name": "Herbalism kit",
      "cost": 500,
      "Weight": "3 lb.",
      "CategoryID": null
  },
  {
      "id": 25,
      "name": "Bagpipes",
      "cost": 3000,
      "Weight": "6 lb.",
      "CategoryID": 8
  },
  {
      "id": 26,
      "name": "Drum",
      "cost": 600,
      "Weight": "3 lb.",
      "CategoryID": 8
  },
  {
      "id": 27,
      "name": "Dulcimer",
      "cost": 2500,
      "Weight": "10 lb.",
      "CategoryID": 8
  },
  {
      "id": 28,
      "name": "Flute",
      "cost": 200,
      "Weight": "1 lb.",
      "CategoryID": 8
  },
  {
      "id": 29,
      "name": "Lute",
      "cost": 3500,
      "Weight": "2 lb.",
      "CategoryID": 8
  },
  {
      "id": 30,
      "name": "Lyre",
      "cost": 3000,
      "Weight": "2 lb.",
      "CategoryID": 8
  },
  {
      "id": 31,
      "name": "Horn",
      "cost": 300,
      "Weight": "2 lb.",
      "CategoryID": 8
  },
  {
      "id": 32,
      "name": "Pan flute",
      "cost": 1200,
      "Weight": "2 lb.",
      "CategoryID": 8
  },
  {
      "id": 33,
      "name": "Shawm",
      "cost": 200,
      "Weight": "1 lb.",
      "CategoryID": 8
  },
  {
      "id": 34,
      "name": "Viol",
      "cost": 3000,
      "Weight": "1 lb.",
      "CategoryID": 8
  },
  {
      "id": 35,
      "name": "Navigator’s tools",
      "cost": 2500,
      "Weight": "2 lb.",
      "CategoryID": null
  },
  {
      "id": 36,
      "name": "Poisoner’s kit",
      "cost": 5000,
      "Weight": "2 lb.",
      "CategoryID": null
  },
  {
      "id": 37,
      "name": "Thieves’ tools",
      "cost": 2500,
      "Weight": "1 lb.",
      "CategoryID": null
  }
            ];
        },
        AdventuringGear: function () {
            return [

  {
      "id": 1,
      "name": "Abacus",
      "cost": 200,
      "Weight": "2 lb.",
      "CategoryID": null
  },
  {
      "id": 2,
      "name": "Acid (vial)",
      "cost": 2500,
      "Weight": "1 lb.",
      "CategoryID": null
  },
  {
      "id": 3,
      "name": "Alchemist’s fire (flask)",
      "cost": 5000,
      "Weight": "1 lb.",
      "CategoryID": null
  },
  {
      "id": 4,
      "name": "Arrows (20)",
      "cost": 100,
      "Weight": "1 lb.",
      "CategoryID": 1
  },
  {
      "id": 5,
      "name": "Blowgun needles (50)",
      "cost": 100,
      "Weight": "1 lb.",
      "CategoryID": 1
  },
  {
      "id": 6,
      "name": "Crossbow bolts (20)",
      "cost": 100,
      "Weight": "1½ lb.",
      "CategoryID": 1
  },
  {
      "id": 7,
      "name": "Sling bullets (20)",
      "cost": 4,
      "Weight": "1½ lb.",
      "CategoryID": 1
  },
  {
      "id": 8,
      "name": "Antitoxin (vial)",
      "cost": 5000,
      "Weight": null,
      "CategoryID": null
  },
  {
      "id": 9,
      "name": "Crystal",
      "cost": 1000,
      "Weight": "1 lb.",
      "CategoryID": 2
  },
  {
      "id": 10,
      "name": "Orb",
      "cost": 2000,
      "Weight": "3 lb.",
      "CategoryID": 2
  },
  {
      "id": 11,
      "name": "Rod",
      "cost": 1000,
      "Weight": "2 lb.",
      "CategoryID": 2
  },
  {
      "id": 12,
      "name": "Staff",
      "cost": 500,
      "Weight": "4 lb.",
      "CategoryID": 2
  },
  {
      "id": 13,
      "name": "Wand",
      "cost": 1000,
      "Weight": "1 lb.",
      "CategoryID": 2
  },
  {
      "id": 14,
      "name": "Backpack",
      "cost": 200,
      "Weight": "5 lb.",
      "CategoryID": 5
  },
  {
      "id": 15,
      "name": "Ball bearings (bag of 1,000)",
      "cost": 100,
      "Weight": "2 lb.",
      "CategoryID": null
  },
  {
      "id": 16,
      "name": "Barrel",
      "cost": 200,
      "Weight": "70 lb.",
      "CategoryID": 5
  },
  {
      "id": 17,
      "name": "Basket",
      "cost": 40,
      "Weight": "2 lb.",
      "CategoryID": 5
  },
  {
      "id": 18,
      "name": "Bedroll",
      "cost": 100,
      "Weight": "7 lb.",
      "CategoryID": null
  },
  {
      "id": 19,
      "name": "Bell",
      "cost": 100,
      "Weight": null,
      "CategoryID": null
  },
  {
      "id": 20,
      "name": "Blanket",
      "cost": 50,
      "Weight": "3 lb.",
      "CategoryID": null
  },
  {
      "id": 21,
      "name": "Block and tackle",
      "cost": 100,
      "Weight": "5 lb.",
      "CategoryID": null
  },
  {
      "id": 22,
      "name": "Book",
      "cost": 2500,
      "Weight": "5 lb.",
      "CategoryID": null
  },
  {
      "id": 23,
      "name": "Bottle, glass",
      "cost": 200,
      "Weight": "2 lb.",
      "CategoryID": 5
  },
  {
      "id": 24,
      "name": "Bucket",
      "cost": 5,
      "Weight": "2 lb.",
      "CategoryID": 5
  },
  {
      "id": 25,
      "name": "Caltrops (bag of 20)",
      "cost": 100,
      "Weight": "2 lb.",
      "CategoryID": null
  },
  {
      "id": 26,
      "name": "Candle",
      "cost": 1,
      "Weight": null,
      "CategoryID": null
  },
  {
      "id": 27,
      "name": "Case, crossbow bolt",
      "cost": 100,
      "Weight": "1 lb.",
      "CategoryID": null
  },
  {
      "id": 28,
      "name": "Case, map or scroll",
      "cost": 100,
      "Weight": "1 lb.",
      "CategoryID": null
  },
  {
      "id": 29,
      "name": "Chain (10 feet)",
      "cost": 500,
      "Weight": "10 lb.",
      "CategoryID": null
  },
  {
      "id": 30,
      "name": "Chalk (1 piece)",
      "cost": 1,
      "Weight": null,
      "CategoryID": null
  },
  {
      "id": 31,
      "name": "Chest",
      "cost": 500,
      "Weight": "25 lb.",
      "CategoryID": 5
  },
  {
      "id": 32,
      "name": "Climber’s kit",
      "cost": 2500,
      "Weight": "12 lb.",
      "CategoryID": null
  },
  {
      "id": 33,
      "name": "Clothes, common",
      "cost": 50,
      "Weight": "3 lb.",
      "CategoryID": null
  },
  {
      "id": 34,
      "name": "Clothes, costume",
      "cost": 500,
      "Weight": "4 lb.",
      "CategoryID": null
  },
  {
      "id": 35,
      "name": "Clothes, fine",
      "cost": 1500,
      "Weight": "6 lb.",
      "CategoryID": null
  },
  {
      "id": 36,
      "name": "Clothes, traveler’s",
      "cost": 200,
      "Weight": "4 lb.",
      "CategoryID": null
  },
  {
      "id": 37,
      "name": "Component pouch",
      "cost": 2500,
      "Weight": "2 lb.",
      "CategoryID": null
  },
  {
      "id": 38,
      "name": "Crowbar",
      "cost": 200,
      "Weight": "5 lb.",
      "CategoryID": null
  },
  {
      "id": 39,
      "name": "Sprig of mistletoe",
      "cost": 100,
      "Weight": null,
      "CategoryID": 3
  },
  {
      "id": 40,
      "name": "Totem",
      "cost": 100,
      "Weight": null,
      "CategoryID": 3
  },
  {
      "id": 41,
      "name": "Wooden staff",
      "cost": 500,
      "Weight": "4 lb.",
      "CategoryID": 3
  },
  {
      "id": 42,
      "name": "Yew wand",
      "cost": 1000,
      "Weight": "1 lb.",
      "CategoryID": 3
  },
  {
      "id": 43,
      "name": "Fishing tackle",
      "cost": 100,
      "Weight": "4 lb.",
      "CategoryID": null
  },
  {
      "id": 44,
      "name": "Flask or tankard",
      "cost": 2,
      "Weight": "1 lb.",
      "CategoryID": 5
  },
  {
      "id": 45,
      "name": "Grappling hook",
      "cost": 200,
      "Weight": "4 lb.",
      "CategoryID": null
  },
  {
      "id": 46,
      "name": "Hammer",
      "cost": 100,
      "Weight": "3 lb.",
      "CategoryID": null
  },
  {
      "id": 47,
      "name": "Hammer, sledge",
      "cost": 200,
      "Weight": "10 lb.",
      "CategoryID": null
  },
  {
      "id": 48,
      "name": "Healer’s kit",
      "cost": 500,
      "Weight": "3 lb.",
      "CategoryID": null
  },
  {
      "id": 49,
      "name": "Amulet",
      "cost": 500,
      "Weight": "1 lb.",
      "CategoryID": 4
  },
  {
      "id": 50,
      "name": "Emblem",
      "cost": 500,
      "Weight": null,
      "CategoryID": 4
  },
  {
      "id": 51,
      "name": "Reliquary",
      "cost": 500,
      "Weight": "2 lb.",
      "CategoryID": 4
  },
  {
      "id": 52,
      "name": "Holy water (flask)",
      "cost": 2500,
      "Weight": "1 lb.",
      "CategoryID": null
  },
  {
      "id": 53,
      "name": "Hourglass",
      "cost": 2500,
      "Weight": "1 lb.",
      "CategoryID": null
  },
  {
      "id": 54,
      "name": "Hunting trap",
      "cost": 500,
      "Weight": "25 lb.",
      "CategoryID": null
  },
  {
      "id": 55,
      "name": "Ink (1 ounce bottle)",
      "cost": 1000,
      "Weight": null,
      "CategoryID": null
  },
  {
      "id": 56,
      "name": "Ink pen",
      "cost": 2,
      "Weight": null,
      "CategoryID": null
  },
  {
      "id": 57,
      "name": "Jug or pitcher",
      "cost": 2,
      "Weight": "4 lb.",
      "CategoryID": 5
  },
  {
      "id": 58,
      "name": "Ladder (10-foot)",
      "cost": 10,
      "Weight": "25 lb.",
      "CategoryID": null
  },
  {
      "id": 59,
      "name": "Lamp",
      "cost": 50,
      "Weight": "1 lb.",
      "CategoryID": null
  },
  {
      "id": 60,
      "name": "Lantern, bullseye",
      "cost": 1000,
      "Weight": "2 lb.",
      "CategoryID": null
  },
  {
      "id": 61,
      "name": "Lantern, hooded",
      "cost": 500,
      "Weight": "2 lb.",
      "CategoryID": null
  },
  {
      "id": 62,
      "name": "Lock",
      "cost": 1000,
      "Weight": "1 lb.",
      "CategoryID": null
  },
  {
      "id": 63,
      "name": "Magnifying glass",
      "cost": 10000,
      "Weight": null,
      "CategoryID": null
  },
  {
      "id": 64,
      "name": "Manacles",
      "cost": 200,
      "Weight": "6 lb.",
      "CategoryID": null
  },
  {
      "id": 65,
      "name": "Mess kit",
      "cost": 20,
      "Weight": "1 lb.",
      "CategoryID": null
  },
  {
      "id": 66,
      "name": "Mirror, steel",
      "cost": 500,
      "Weight": "1/2 lb.",
      "CategoryID": null
  },
  {
      "id": 67,
      "name": "Oil (flask)",
      "cost": 10,
      "Weight": "1 lb.",
      "CategoryID": null
  },
  {
      "id": 68,
      "name": "Paper (one sheet)",
      "cost": 20,
      "Weight": null,
      "CategoryID": null
  },
  {
      "id": 69,
      "name": "Parchment (one sheet)",
      "cost": 10,
      "Weight": null,
      "CategoryID": null
  },
  {
      "id": 70,
      "name": "Perfume (vial)",
      "cost": 500,
      "Weight": null,
      "CategoryID": null
  },
  {
      "id": 71,
      "name": "Pick, miner’s",
      "cost": 200,
      "Weight": "10 lb.",
      "CategoryID": null
  },
  {
      "id": 72,
      "name": "Piton",
      "cost": 5,
      "Weight": "1/4 lb.",
      "CategoryID": null
  },
  {
      "id": 73,
      "name": "Poison, basic (vial)",
      "cost": 10000,
      "Weight": null,
      "CategoryID": null
  },
  {
      "id": 74,
      "name": "Pole (10-foot)",
      "cost": 5,
      "Weight": "7 lb.",
      "CategoryID": null
  },
  {
      "id": 75,
      "name": "Pot, iron",
      "cost": 200,
      "Weight": "10 lb.",
      "CategoryID": 5
  },
  {
      "id": 76,
      "name": "Potion of healing",
      "cost": 5000,
      "Weight": "1/2 lb.",
      "CategoryID": null
  },
  {
      "id": 77,
      "name": "Pouch",
      "cost": 50,
      "Weight": "1 lb.",
      "CategoryID": 5
  },
  {
      "id": 78,
      "name": "Quiver",
      "cost": 100,
      "Weight": "1 lb.",
      "CategoryID": null
  },
  {
      "id": 79,
      "name": "Ram, portable",
      "cost": 400,
      "Weight": "35 lb.",
      "CategoryID": null
  },
  {
      "id": 80,
      "name": "Rations (1 day)",
      "cost": 50,
      "Weight": "2 lb.",
      "CategoryID": null
  },
  {
      "id": 81,
      "name": "Robes",
      "cost": 100,
      "Weight": "4 lb.",
      "CategoryID": null
  },
  {
      "id": 82,
      "name": "Rope, hempen (50 feet)",
      "cost": 100,
      "Weight": "10 lb.",
      "CategoryID": null
  },
  {
      "id": 83,
      "name": "Rope, silk (50 feet)",
      "cost": 1000,
      "Weight": "5 lb.",
      "CategoryID": null
  },
  {
      "id": 84,
      "name": "Sack",
      "cost": 1,
      "Weight": "1/2 lb.",
      "CategoryID": 5
  },
  {
      "id": 85,
      "name": "Scale, merchant’s",
      "cost": 500,
      "Weight": "3 lb.",
      "CategoryID": null
  },
  {
      "id": 86,
      "name": "Sealing wax",
      "cost": 50,
      "Weight": null,
      "CategoryID": null
  },
  {
      "id": 87,
      "name": "Shovel",
      "cost": 200,
      "Weight": "5 lb.",
      "CategoryID": null
  },
  {
      "id": 88,
      "name": "Signal whistle",
      "cost": 5,
      "Weight": null,
      "CategoryID": null
  },
  {
      "id": 89,
      "name": "Signet ring",
      "cost": 500,
      "Weight": null,
      "CategoryID": null
  },
  {
      "id": 90,
      "name": "Soap",
      "cost": 2,
      "Weight": null,
      "CategoryID": null
  },
  {
      "id": 91,
      "name": "Spellbook",
      "cost": 5000,
      "Weight": "3 lb.",
      "CategoryID": null
  },
  {
      "id": 92,
      "name": "Spikes, iron (10)",
      "cost": 100,
      "Weight": "5 lb.",
      "CategoryID": null
  },
  {
      "id": 93,
      "name": "Spyglass",
      "cost": 100000,
      "Weight": "1 lb.",
      "CategoryID": null
  },
  {
      "id": 94,
      "name": "Tent, two-person",
      "cost": 200,
      "Weight": "20 lb.",
      "CategoryID": null
  },
  {
      "id": 95,
      "name": "Tinderbox",
      "cost": 50,
      "Weight": "1 lb.",
      "CategoryID": null
  },
  {
      "id": 96,
      "name": "Torch",
      "cost": 1,
      "Weight": "1 lb.",
      "CategoryID": null
  },
  {
      "id": 97,
      "name": "Vial",
      "cost": 100,
      "Weight": null,
      "CategoryID": 5
  },
  {
      "id": 98,
      "name": "Waterskin",
      "cost": 20,
      "Weight": "5 lb. (full)",
      "CategoryID": 5
  },
  {
      "id": 99,
      "name": "Whetstone",
      "cost": 1,
      "Weight": "1 lb.",
      "CategoryID": null
  },
  {
      "id": 100,
      "name": "10 feet of string",
      "Cost": null,
      "Weight": null,
      "CategoryID": 11
  },
    {
        "id": 101,
        "name": "Alms box",
        "Cost": null,
        "Weight": null,
        "CategoryID": 11
    },
                {
                    "id": 102,
                    "name": "Incense (block)",
                    "Cost": null,
                    "Weight": null,
                    "CategoryID": 11
                },
                {
                    "id": 103,
                    "name": "Censer",
                    "Cost": null,
                    "Weight": null,
                    "CategoryID": 11
                },
                {
                    "id": 104,
                    "name": "Vestments",
                    "Cost": null,
                    "Weight": null,
                    "CategoryID": 11
                },
                {
                    "id": 105,
                    "name": "Book of lore",
                    "Cost": null,
                    "Weight": null,
                    "CategoryID": 11
                },
                {
                    "id": 106,
                    "name": "Little sand bag",
                    "Cost": null,
                    "Weight": null,
                    "CategoryID": 11
                },
                {
                    "id": 107,
                    "name": "Small knife",
                    "Cost": null,
                    "Weight": null,
                    "CategoryID": 11
                },
            ];
        },
        EquipmentPacks: function () {
            return [
                {
                    "id": 1,
                    "name": "Burglar’s Pack",
                    "cost": 1600,
                    "contents": [
                        { "itemID": 14, "qty": 1 },  // backpack
                        { "itemID": 15, "qty": 1 },  // ball berrings
                        { "itemID": 100, "qty": 1 }, // string
                        { "itemID": 19, "qty": 1 },  // bell
                        { "itemID": 26, "qty": 5 },  // candles
                        { "itemID": 38, "qty": 1 },  // crowbar
                        { "itemID": 46, "qty": 1 },  // hammer
                        { "itemID": 72, "qty": 10 }, // piton
                        { "itemID": 61, "qty": 1 },  // hooded lantern
                        { "itemID": 67, "qty": 2 },  // flasks of oil
                        { "itemID": 80, "qty": 5 },  // rations
                        { "itemID": 95, "qty": 1 },  // tinderbox
                        { "itemID": 98, "qty": 1 },  // waterskin
                        { "itemID": 82, "qty": 1 },  // 50 feet of hempen rope
                    ]
                },
            {
                "id": 2,
                "name": "Diplomat’s Pack",
                "cost": 3900,
                "contents": [
                        { "itemID": 31, "qty": 1 },  // chest
                        { "itemID": 28, "qty": 2 },  // cases for maps and scrolls
                        { "itemID": 35, "qty": 1 },  // fine clothes
                        { "itemID": 19, "qty": 1 },  // bell
                        { "itemID": 55, "qty": 1 },  // bottle of ink
                        { "itemID": 56, "qty": 1 },  // ink pen
                        { "itemID": 59, "qty": 1 },  // lamp
                        { "itemID": 67, "qty": 2 },  // flasks of oil 
                        { "itemID": 68, "qty": 5 },  // sheets of paper
                        { "itemID": 70, "qty": 1 },  // vial of perfume
                        { "itemID": 86, "qty": 1 },  // sealing wax
                        { "itemID": 90, "qty": 1 },  // soap
                ]
            },
            {
                "id": 3,
                "name": "Dungeoneer’s Pack",
                "cost": 1200,
                "contents": [
                        { "itemID": 14, "qty": 1 },  // backpack
                        { "itemID": 38, "qty": 1 },  // crowbar 
                        { "itemID": 46, "qty": 1 },  // hammer
                        { "itemID": 72, "qty": 10 }, // piton
                        { "itemID": 96, "qty": 10 }, // torches
                        { "itemID": 95, "qty": 1 },  // tinderbox
                        { "itemID": 80, "qty": 10 }, // rations
                        { "itemID": 98, "qty": 1 },  // waterskin
                        { "itemID": 82, "qty": 1 },  // 50 feet of hempen rope
                ]
            },
            {
                "id": 4,
                "name": "Entertainer’s Pack",
                "cost": 4000,
                "contents": [
                        { "itemID": 14, "qty": 1 },  // backpack
                        { "itemID": 18, "qty": 1 },  // bedroll 
                        { "itemID": 34, "qty": 2 },  // costumes
                        { "itemID": 26, "qty": 5 },  // candles
                        { "itemID": 80, "qty": 5 },  // rations
                        { "itemID": 98, "qty": 1 },  // waterskin 
                        { "toolID": 18, "qty": 1 },  // disguise kit
                ]
            },
            {
                "id": 5,
                "name": "Explorer’s Pack",
                "cost": 1000,
                "contents": [
                        { "itemID": 14, "qty": 1 },  // backpack
                        { "itemID": 18, "qty": 1 },  // bedroll 
                        { "itemID": 65, "qty": 1 },  // mess kit
                        { "itemID": 95, "qty": 1 },  // tinderbox
                        { "itemID": 96, "qty": 10 }, // torches
                        { "itemID": 80, "qty": 10 }, // rations
                        { "itemID": 98, "qty": 1 },  // waterskin
                        { "itemID": 82, "qty": 1 },  // 50 feet of hempen rope
                ]
            },
            {
                "id": 6,
                "name": "Priest’s Pack",
                "cost": 1000,
                "contents": [
                        { "itemID": 14, "qty": 1 },  // backpack
                        { "itemID": 20, "qty": 1 },  // blanket 
                        { "itemID": 26, "qty": 10 }, // candles
                        { "itemID": 95, "qty": 1 },  // tinderbox
                        { "itemID": 101, "qty": 1 }, // alms box
                        { "itemID": 102, "qty": 2 }, // blocks of incense
                        { "itemID": 103, "qty": 1 }, // censer
                        { "itemID": 104, "qty": 1 }, // vestments
                        { "itemID": 80, "qty": 2 },  // rations
                        { "itemID": 98, "qty": 1 },  // waterskin
                ]
            },
            {
                "id": 7,
                "name": "Scholar’s Pack",
                "cost": 4000,
                "contents": [
                        { "itemID": 14, "qty": 1 },  // backpack
                        { "itemID": 105, "qty": 1 }, // book of lore
                        { "itemID": 55, "qty": 1 },  // bottle of ink
                        { "itemID": 56, "qty": 1 },  // ink pen
                        { "itemID": 69, "qty": 10 }, // sheets of parchment
                        { "itemID": 106, "qty": 1 }, // little bag of sand
                        { "itemID": 107, "qty": 1 }, // small knife
                ]
            },

            ];
        },
        DivineDomains: function () {
            return [
                {
                    "id": 1,
                    "name": "Knowledge",
                    "desc": "The gods of knowledge—including Oghma, Boccob, Gilean, Aureon, and Thoth—value learning and understanding above all. Some teach that knowledge is to be gathered and shared in libraries and universities, or promote the practical knowledge of craft and invention. Some deities hoard knowledge and keep its secrets to themselves. And some promise their followers that they will gain tremendous power if they unlock the secrets of the multiverse. Followers of these gods study esoteric lore, collect old tomes, delve into the secret places of the earth, and learn all they can. Some gods of knowledge promote the practical knowledge of craft and invention, including smith deities like Gond, Reorx, Onatar, Moradin, Hephaestus, and Goibhniu.",
                    "spells": [
                        { "level": 1, "spells": ["command", "identify"] },
                        { "level": 3, "spells": ["augury", "suggestion"] },
                        { "level": 5, "spells": ["nondetection", "speak with dead"] },
                        { "level": 7, "spells": ["arcane eye", "confusion"] },
                        { "level": 9, "spells": ["legend lore", "scrying"] },
                    ],
                    "traits": [
                        {"level":1,"name":"Blessings of Knowledge", "desc":"At 1st level, you learn two languages of your choice. You also become proficient in your choice of two of the following skills: Arcana, History, Nature, or Religion. Your proficiency bonus is doubled for any ability check you make that uses either of those skills."},
                    ],
                },
                { "id": 2, "name": "Life" },
                { "id": 3, "name": "Light" },
                { "id": 4, "name": "Nature" },
                { "id": 5, "name": "Tempest" },
                { "id": 6, "name": "Trickery" },
                { "id": 7, "name": "War" },
            ];
        },
        Dieties: function () {
            return [
                {
                    "id": 1,
                    "pantheon": "The Forgotten Realms",
                    "name": "",
                    "Alignment": "",
                    "SuggestedDomains": [],
                    "Symbol": "",
                },
            ];
        },
    }
});
