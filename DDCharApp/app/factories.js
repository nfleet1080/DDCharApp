var dndapp = angular.module('dndFactories', ['ionic', 'ngStorage']);

dndapp.factory('DetailService', function ($filter, DataService) {
    // quick way to return all details of a chosen race
    return {
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
        getModifier: function (abilityID) {
            // calculate the character's modifier for a particular ability score
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
                      ]
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
                      ]
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
                      ]
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
                      ]
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
                      ]
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
                      ]
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
              'speed': 30,
              'traits': [
              ],
              'languages': [1, 9],
              'subrace': [
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
     "Tools":[],
     "Skills": {"HowMany":2,"Choices":[6,11,12,18,9]},
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
     "Tools": [],
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
     "Tools": [],
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
     "Tools": [],
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
            ];
        },
        Armor: function () {
            return [
  {
      "id": 1,
      "typeID": 1,
      "name": "Padded",
      "cost": "5 gp",
      "armorClass": "11 + Dex modifier",
      "strength": "—",
      "stealth": "Disadvantage",
      "weight": "8 lb."
  },
  {
      "id": 2,
      "typeID": 1,
      "name": "Leather",
      "cost": "10 gp",
      "armorClass": "11 + Dex modifier",
      "strength": "—",
      "stealth": "—",
      "weight": "10 lb."
  },
  {
      "id": 3,
      "typeID": 1,
      "name": "Studded leather",
      "cost": "45 gp",
      "armorClass": "12 + Dex modifier",
      "strength": "—",
      "stealth": "—",
      "weight": "13 lb."
  },
  {
      "id": 4,
      "typeID": 2,
      "name": "Hide",
      "cost": "10 gp",
      "armorClass": "12 + Dex modifier (max 2)",
      "strength": "—",
      "stealth": "—",
      "weight": "12 lb."
  },
  {
      "id": 5,
      "typeID": 2,
      "name": "Chain shirt",
      "cost": "50 gp",
      "armorClass": "13 + Dex modifier (max 2)",
      "strength": "—",
      "stealth": "—",
      "weight": "20 lb."
  },
  {
      "id": 6,
      "typeID": 2,
      "name": "Scale mail",
      "cost": "50 gp",
      "armorClass": "14 + Dex modifier (max 2)",
      "strength": "—",
      "stealth": "Disadvantage",
      "weight": "45 lb."
  },
  {
      "id": 7,
      "typeID": 2,
      "name": "Breastplate",
      "cost": "400 gp",
      "armorClass": "14 + Dex modifier (max 2)",
      "strength": "—",
      "stealth": "—",
      "weight": "20 lb."
  },
  {
      "id": 8,
      "typeID": 2,
      "name": "Half plate",
      "cost": "750 gp",
      "armorClass": "15 + Dex modifier (max 2)",
      "strength": "—",
      "stealth": "Disadvantage",
      "weight": "40 lb."
  },
  {
      "id": 9,
      "typeID": 3,
      "name": "Ring mail",
      "cost": "30 gp",
      "armorClass": "14",
      "strength": "—",
      "stealth": "Disadvantage",
      "weight": "40 lb."
  },
  {
      "id": 10,
      "typeID": 3,
      "name": "Chain mail",
      "cost": "75 gp",
      "armorClass": "16",
      "strength": "Str 13",
      "stealth": "Disadvantage",
      "weight": "55 lb."
  },
  {
      "id": 11,
      "typeID": 3,
      "name": "Splint",
      "cost": "200 gp",
      "armorClass": "17",
      "strength": "Str 15",
      "stealth": "Disadvantage",
      "weight": "60 lb."
  },
  {
      "id": 12,
      "typeID": 3,
      "name": "Plate",
      "cost": "1,500 gp",
      "armorClass": "18",
      "strength": "Str 15",
      "stealth": "Disadvantage",
      "weight": "65 lb."
  },
  {
      "id": 13,
      "typeID": 4,
      "name": "Shield",
      "cost": "10 gp",
      "armorClass": "2",
      "strength": "—",
      "stealth": "—",
      "weight": "6 lb."
  }
            ];
        },
        Weapons: function () {
            return [
  {
      "id": 1,
      "typeID": 5,
      "name": "Club",
      "cost": "1 sp",
      "damage": "1d4 bludgeoning",
      "weight": "2 lb.",
      "properties": ["Light"],
      "Versatile": "",
      "normalrange": 5,
      "longrange":5
            },
  {
      "id": 2,
      "typeID": 5,
      "name": "Dagger",
      "cost": "2 gp",
      "damage": "1d4 piercing",
      "weight": "1 lb.",
      "properties": ["Finesse", "Light", "Thrown"],
      "Versatile": "",
      "normalrange": 20,
      "longrange": 60
  },
  {
      "id": 3,
      "typeID": 5,
      "name": "Greatclub",
      "cost": "2 sp",
      "damage": "1d8 bludgeoning",
      "weight": "10 lb.",
      "properties": ["Two-handed"],
      "Versatile": "",
      "normalrange": 5,
      "longrange": 5
  },
  {
      "id": 4,
      "typeID": 5,
      "name": "Handaxe",
      "cost": "5 gp",
      "damage": "1d6 slashing",
      "weight": "2 lb.",
      "properties": ["Light","Thrown"],
      "Versatile": "",
      "normalrange": 20,
      "longrange":60
  },
  {
      "id": 5,
      "typeID": 5,
      "name": "Javelin",
      "cost": "5 sp",
      "damage": "1d6 piercing",
      "weight": "2 lb.",
      "properties": ["Thrown"],
      "Versatile": "",
      "normalrange": 30,
      "longrange":120

  },
  {
      "id": 6,
      "typeID": 5,
      "name": "Light hammer",
      "cost": "2 gp",
      "damage": "1d4 bludgeoning",
      "weight": "2 lb.",
      "properties": ["Light", "Thrown"],
      "Versatile": "",
      "normalrange": 20,
      "longrange":60
  },
  {
      "id": 7,
      "typeID": 5,
      "name": "Mace",
      "cost": "5 gp",
      "damage": "1d6 bludgeoning",
      "weight": "4 lb.",
      "properties": [],
      "Versatile": "",
      "normalrange": 5,
      "longrange": 5
  },
  {
      "id": 8,
      "typeID": 5,
      "name": "Quarterstaff",
      "cost": "2 sp",
      "damage": "1d6 bludgeoning",
      "weight": "4 lb.",
      "properties": ["Versatile"],
      "Versatile": "1d8",
      "normalrange": 5,
      "longrange": 5
  },
  {
      "id": 9,
      "typeID": 5,
      "name": "Sickle",
      "cost": "1 gp",
      "damage": "1d4 slashing",
      "weight": "2 lb.",
      "properties": ["Light"],
      "Versatile": "",
      "normalrange": 5,
      "longrange": 5
  },
  {
      "id": 10,
      "typeID": 5,
      "name": "Spear",
      "cost": "1 gp",
      "damage": "1d6 piercing",
      "weight": "3 lb.",
      "properties": ["Thrown", "Versatile"],
      "Versatile": "1d8",
      "normalrange": 20,
      "longrange": 60
  },
  {
      "id": 11,
      "typeID": 5,
      "name": "Unarmed strike",
      "cost": "—",
      "damage": "1 bludgeoning",
      "weight": "—",
      "properties": [],
      "Versatile": "",
      "normalrange": 5,
      "longrange": 5
  },
  {
      "id": 12,
      "typeID": 6,
      "name": "Light Crossbow",
      "cost": "25 gp",
      "damage": "1d8 piercing",
      "weight": "5 lb.",
      "properties": ["Ammunition", "Loading", "Two-handed"],
      "Versatile": "",
      "normalrange": 80,
      "longrange": 320
  },
  {
      "id": 13,
      "typeID": 6,
      "name": "Dart",
      "cost": "5 cp",
      "damage": "1d4 piercing",
      "weight": "1/4 lb.",
      "properties": ["Finesse", "Thrown"],
      "Versatile": "",
      "normalrange": 20,
      "longrange": 60
  },
  {
      "id": 14,
      "typeID": 6,
      "name": "Shortbow",
      "cost": "25 gp",
      "damage": "1d6 piercing",
      "weight": "2 lb.",
      "properties": ["Ammunition", "Two-handed"],
      "Versatile": "",
      "normalrange": 80,
      "longrange": 320
  },
  {
      "id": 15,
      "typeID": 6,
      "name": "Sling",
      "cost": "1 sp",
      "damage": "1d4 bludgeoning",
      "weight": "—",
      "properties": ["Ammunition"],
      "Versatile": "",
      "normalrange": 30,
      "longrange": 120
  },
  {
      "id": 16,
      "typeID": 7,
      "name": "Battleaxe",
      "cost": "10 gp",
      "damage": "1d8 slashing",
      "weight": "4 lb.",
      "properties": ["Versatile"],
      "Versatile": "1d10",
      "normalrange": 5,
      "longrange": 5
  },
  {
      "id": 17,
      "typeID": 7,
      "name": "Flail",
      "cost": "10 gp",
      "damage": "1d8 bludgeoning",
      "weight": "2 lb.",
      "properties": [],
      "Versatile": "",
      "normalrange": 5,
      "longrange": 5
  },
  {
      "id": 18,
      "typeID": 7,
      "name": "Glaive",
      "cost": "20 gp",
      "damage": "1d10 slashing",
      "weight": "6 lb.",
      "properties": ["Heavy", "Reach", "Two-handed"],
      "Versatile": "",
      "normalrange": 10,
      "longrange": 10
  },
  {
      "id": 19,
      "typeID": 7,
      "name": "Greataxe",
      "cost": "30 gp",
      "damage": "1d12 slashing",
      "weight": "7 lb.",
      "properties": ["Heavy", "Two-handed"],
      "Versatile": "",
      "normalrange": 5,
      "longrange": 5
  },
  {
      "id": 20,
      "typeID": 7,
      "name": "Greatsword",
      "cost": "50 gp",
      "damage": "2d6 slashing",
      "weight": "6 lb.",
      "properties": ["Heavy", "Two-handed"],
      "Versatile": "",
      "normalrange": 5,
      "longrange": 5
  },
  {
      "id": 21,
      "typeID": 7,
      "name": "Halberd",
      "cost": "20 gp",
      "damage": "1d10 slashing",
      "weight": "6 lb.",
      "properties": ["Heavy", "Reach", "Two-handed"],
      "Versatile": "",
      "normalrange": 10,
      "longrange": 10
  },
  {
      "id": 22,
      "typeID": 7,
      "name": "Lance",
      "cost": "10 gp",
      "damage": "1d12 piercing",
      "weight": "6 lb.",
      "properties": ["Reach", "Special"],
      "Versatile": "",
      "normalrange": 5,
      "longrange": 10
  },
  {
      "id": 23,
      "typeID": 7,
      "name": "Longsword",
      "cost": "15 gp",
      "damage": "1d8 slashing",
      "weight": "3 lb.",
      "properties": ["Versatile"],
      "Versatile": "1d10",
      "normalrange": 5,
      "longrange": 5
  },
  {
      "id": 24,
      "typeID": 7,
      "name": "Maul",
      "cost": "10 gp",
      "damage": "2d6 bludgeoning",
      "weight": "10 lb.",
      "properties": ["Heavy", "Two-handed"],
      "Versatile": "",
      "normalrange": 5,
      "longrange": 5
  },
  {
      "id": 25,
      "typeID": 7,
      "name": "Morningstar",
      "cost": "15 gp",
      "damage": "1d8 piercing",
      "weight": "4 lb.",
      "properties": [],
      "Versatile": "",
      "normalrange": 5,
      "longrange": 5
  },
  {
      "id": 26,
      "typeID": 7,
      "name": "Pike",
      "cost": "5 gp",
      "damage": "1d10 piercing",
      "weight": "18 lb.",
      "properties": ["Heavy", "Reach", "Two-handed"],
      "Versatile": "",
      "normalrange": 10,
      "longrange": 10
  },
  {
      "id": 27,
      "typeID": 7,
      "name": "Rapier",
      "cost": "25 gp",
      "damage": "1d8 piercing",
      "weight": "2 lb.",
      "properties": ["Finesse"],
      "Versatile": "",
      "normalrange": 5,
      "longrange": 5
  },
  {
      "id": 28,
      "typeID": 7,
      "name": "Scimitar",
      "cost": "25 gp",
      "damage": "1d6 slashing",
      "weight": "3 lb.",
      "properties": ["Finesse", "Light"],
      "Versatile": "",
      "normalrange": 5,
      "longrange": 5
  },
  {
      "id": 29,
      "typeID": 7,
      "name": "Shortsword",
      "cost": "10 gp",
      "damage": "1d6 piercing",
      "weight": "2 lb.",
      "properties": ["Finesse", "Light"],
      "Versatile": "",
      "normalrange": 5,
      "longrange": 5
  },
  {
      "id": 30,
      "typeID": 7,
      "name": "Trident",
      "cost": "5 gp",
      "damage": "1d6 piercing",
      "weight": "4 lb.",
      "properties": ["Thrown", "Versatile"],
      "Versatile": "1d8",
      "normalrange": 20,
      "longrange": 60
  },
  {
      "id": 31,
      "typeID": 7,
      "name": "War pick",
      "cost": "5 gp",
      "damage": "1d8 piercing",
      "weight": "2 lb.",
      "properties": [],
      "Versatile": "",
      "normalrange": 5,
      "longrange": 5
  },
  {
      "id": 32,
      "typeID": 7,
      "name": "Warhammer",
      "cost": "15 gp",
      "damage": "1d8 bludgeoning",
      "weight": "2 lb.",
      "properties": ["Versatile"],
      "Versatile": "1d10",
      "normalrange": 5,
      "longrange": 5
  },
  {
      "id": 33,
      "typeID": 7,
      "name": "Whip",
      "cost": "2 gp",
      "damage": "1d4 slashing",
      "weight": "3 lb.",
      "properties": ["Finesse", "Reach"],
      "Versatile": "",
      "normalrange": 10,
      "longrange": 10
  },
  {
      "id": 34,
      "typeID": 8,
      "name": "Blowgun",
      "cost": "10 gp",
      "damage": "1 piercing",
      "weight": "1 lb.",
      "properties": ["Ammunition", "Loading"],
      "Versatile": "",
      "normalrange": 25,
      "longrange": 100
  },
  {
      "id": 35,
      "typeID": 8,
      "name": "Hand Crossbow",
      "cost": "75 gp",
      "damage": "1d6 piercing",
      "weight": "3 lb.",
      "properties": ["Ammunition", "Light", "Loading"],
      "Versatile": "",
      "normalrange": 30,
      "longrange": 120
  },
  {
      "id": 36,
      "typeID": 8,
      "name": "Heavy Crossbow",
      "cost": "50 gp",
      "damage": "1d10 piercing",
      "weight": "18 lb.",
      "properties": ["Ammunition", "Heavy", "Loading", "Two-handed"],
      "Versatile": "",
      "normalrange": 100,
      "longrange": 400
  },
  {
      "id": 37,
      "typeID": 8,
      "name": "Longbow",
      "cost": "50 gp",
      "damage": "1d8 piercing",
      "weight": "2 lb.",
      "properties": ["Ammunition", "Heavy", "Two-handed"],
      "Versatile": "",
      "normalrange": 150,
      "longrange": 600
  },
  {
      "id": 38,
      "typeID": 8,
      "name": "Net",
      "cost": "1 gp",
      "damage": "—",
      "weight": "3 lb.",
      "properties": ["Special", "Thrown"],
      "Versatile": "",
      "normalrange": 5,
      "longrange": 15
  }
            ];
        }
    }
});
