//www.amiedd.com/404 Text escape adventure game
// Influenced my childhood adventures of being homeschooled and Zork
        var line = 0;
        var lastCommand;

        var character = {
          conditionTypes: [{
            "key": "bleeding",
            "hpLossPerMinute": 5,
            "healWith": "bandages"
          }],
          moveTypes: [{
            "key": "run",
            "verb": "running",
            "volume": 5
          }, {
            "key": "walk",
            "verb": "walking",
            "volume": 3
          }, {
            "key": "crawl",
            "verb": "crawling",
            "volume": 1
          }],
          directionTypes: [{
            "key": "north"
          }, {
            "key": "east"
          }, {
            "key": "south"
          }, {
            "key": "west"
          }],
          hp: 30,
          direction: "north",
          moveType: "walk",
          conditions: [],
          inventory: [],
          addToInventory: function(item) {
            this.inventory.push(item);
          }
        }

        function changeMotionStatus(status) {
          var obj = false;
          for (var i = 0, iLen = character.moveTypes.length; i < iLen; i++) {
            if (character.moveTypes[i].key == status) {
              obj = character.moveTypes[i];
              break;
            }
          }

          if (obj) {
            character.moveType = obj.key;
            newLine("You are now " + obj.verb + ", your movement level is " + obj.volume);
            newLine("");
          } else {
            newLine(status + " is not a valid motion status");
          }
        }

        function stats() {
          newLine("-- You have " + character.hp + "HP", "yellow");
          newLine("-- You are carring " + character.inventory.length + (character.inventory.length == 1 ? " object" : " objects"), "yellow");

          //inventory stuff
          if (character.inventory.length > 0) {
            for (var i = 0; i < character.inventory.length; i++) {
              newLine("---- " + (i + 1) + ") A " + character.inventory[i].description + " " + character.inventory[i].key, "yellow");
            }
          }

          //movement status
          var obj = false;
          for (var i = 0, iLen = character.moveTypes.length; i < iLen; i++) {
            if (character.moveTypes[i].key == character.moveType) {
              obj = character.moveTypes[i];
              break;
            }
          }
          newLine("-- You are currently " + obj.verb, "yellow");
          newLine("");
        }

        function help() {
          var helptext = [
            "The spirit of Obi-Wan Kenobi will help you",
            "-------",
            "Movement commands",
            "- MOVE [direction]: Move in a direction (north/south/east/west)",
            "-------",
            "Action commands",
            "- LOOK: Look around, your surroundings",
            "- PICKUP [object]: Add an object to your arsenal",
            "- USE [object] WITH [object]: Use an object",
            "-------",
            "Other commands",
            "- STATUS: Are you alive",
            "- CLEAR: Clear the console",
            "-------"
          ];
          for (var i = 0; i < helptext.length; i++) {
            newLine(helptext[i], "green");
          }
          newLine("");
        }

        function newLine(text, classname) {
          window.setTimeout(function() {
          $("body").append('<p ' + (typeof classname == undefined ? '' : 'class="' + classname + '"') + '>' + text + '</p>');
          $(".blinking-cursor").remove();
          $("p:last").append('<span class="blinking-cursor"></span>');

          if ($("p").length > 25) {
            $("p")[0].remove();
          }
          
            $("html, body").animate({ scrollTop: $(document).height() }, "slow");
          },150);
  return false;
        }

        function pickup(object) {
          var pu = false;
          if (typeof window.obj.actions.pickup !== "undefined") {
            for (var i = 0, iLen = window.obj.actions.pickup.length; i < iLen; i++) {
              if (window.obj.actions.pickup[i].key == object.toLowerCase()) {
                pu = window.obj.actions.pickup[i];
                break;
              }
            }
          }

          if (pu) {
            character.addToInventory(pu);
            newLine("You pick up a " + pu['description'] + " " + pu['key'], "green");
            newLine("");
          } else {
            newLine("You can't seem to find a " + object + " to pickup", "red");
            newLine("");
          }
        }

        function narrative() {
          //if there is any narrative
          if (window.obj.content.length > 0) {
            newLine("-------");
            for (var i = 0; i < window.obj.content.length; i++) {
              newLine(window.obj.content[i]['narration']);
            }
            newLine("-------");
            newLine("");
          }
        }

        function use(object) {
          var pu = false;
          if (typeof window.obj.actions.use !== "undefined") {
            for (var i = 0, iLen = window.obj.actions.use.length; i < iLen; i++) {
              if (window.obj.actions.use[i].key == object.toLowerCase()) {
                pu = window.obj.actions.use[i];
                break;
              }
            }
          }

          if (pu) {
            newLine("You use your " + pu['key']);
            newLine(pu['event'])
            window.part = pu['part'];
            newLine("");
            go();
          } else {
            newLine("You can't use a " + object + " here", "red");
            newLine("");
          }
        }

        function move(direction) {
          var obj = false;
          for (var i = 0, iLen = window.obj.movement.length; i < iLen; i++) {
            if (window.obj.movement[i].key == direction.toLowerCase()) {
              obj = window.obj.movement[i];
              break;
            }
          }

          if (obj) {
            if (obj['passable']) {
              newLine("You move to the " + obj['key']);
              window.part = obj['part'];
              newLine("");
              go();
            } else {
              newLine(obj['inspection']);
              newLine("Try another path");
              newLine("");
            }
          } else {
            newLine(direction + " is not a valid direction to move in", "red");
            newLine("");
          }
        }

        function clear() {
          $("p").remove();
          newLine("");
        }

        function look() {
          if (window.obj.movement.length > 0) {
            newLine("-------");
            newLine("You look around...", "yellow", "yellow");
            for (var i = 0; i < window.obj.movement.length; i++) {
              newLine("-- " + window.obj.movement[i]['inspection'], "yellow");
            }
            newLine("-------");
            newLine("");
          } else {
            newLine("There is nothing to see", "red");
            newLine("");
          }
        }

        function parseCommand(command) {
          lastCommand = command;

          var error = "";
          if (command == "") {
            newLine("No command was entered", "red");
            newLine("");
          } else {
            switch (command.split(" ")[0]) {
              case "NARRATIVE":
                narrative();
                break;
              case "USE":
                use(command.split(" ")[1]);
                break;
              case "MOVE":
                move(command.split(" ")[1])
                break;
              case "STATUS":
                stats();
                break;
              case "PICKUP":
                pickup(command.split(" ")[1]);
                break;
              case "RUN":
                changeMotionStatus("run");
                break;
              case "WALK":
                changeMotionStatus("walk");
                break;
              case "CRAWL":
                changeMotionStatus("crawl");
                break;
              case "CLEAR":
                clear();
                break;
              case "HELP":
                help();
                break;
              case "LOOK":
                look();
                break;
              default:
                newLine("Command '" + command.split(" ")[0] + "' was not recognised", "red");
                newLine("");
                break;
            }
          }
          return true;
        }

        $(window).keyup(function(e) {
          var charCode = e.which;
          if (e.which == 13) {
            parseCommand($("p:last").text());
          } else if (e.which == 43 || e.which == 8) {
            $("p:last").html($("p:last").text().slice(0, -1));
            e.preventDefault();
          } else if (e.which == 38) {
            $("p:last").append(lastCommand);
            lastCommand = "";
          } else {
            $("p:last").append(String.fromCharCode(e.which));
          }
          $(".blinking-cursor").remove();
          $("p:last").append('<span class="blinking-cursor"></span>');
        });

        window.part = "1.0";
        window.obj = {};
        window.story = $.parseJSON('{"story":{"part":[{"partId":1.0,"content":[{"narration":"You awake in the mouth of an dragon(RIP Bob). You slowly adjust your eyes to your surroundings. "},{"narration":"All around you are glitter unicorns, pieces of BOB(RIP), sparkling electronic equipment. You smell something burning."},{"narration":"You must escape to save the prince from his tower...Or just leave him to burn, he never did anything for you anyways."},{"narration":"...."},{"narration":"For the controls, type \'help\' and hit enter."}],"movement":[{"key":"north","passable":false,"inspection":"To the north is only those white walker dudes, you would never make it through unless you have a dragon, not without dying and becoming a white walker anyway"},{"key":"east","passable":false,"inspection":"The east is blocked off by a pile of rubble"},{"key":"south","passable":true,"part":1.3,"inspection":"The south passage is clear, leading to the exit"},{"key":"west","passable":true,"part":1.1,"inspection":"To the west is a small service room, it looks like there is something on the floor"}],"actions":[]},{"partId":1.1,"content":[{"narration":"You head west, away from the flames, in to the small service room."},{"narration":"The smoke is rising towards a fire alarm, once it is triggered the door will seal."},{"narration":"You notice a boomstick on the floor, that could be useful."}],"movement":[{"key":"north","passable":false,"inspection":"To the north is only a solid wall"},{"key":"east","passable":true,"part":1.11,"inspection":"To the east is the only exit, leading back in to the previous room"},{"key":"south","passable":true,"inspection":"To the south the passage way has collapsed, blocking your path"},{"key":"west","passable":false,"inspection":"To the west is only a solid, highly damaged wall"}],"actions":{"pickup":[{"key":"boomstick","description":"heavy steel","weight":15}]}},{"partId":1.11,"content":[{"narration":"The flames have worsened and toxic smoke clouds are filling the room."},{"narration":"The door seals behind you and an alarm sounds"}],"movement":[{"key":"north","passable":false,"inspection":"To the north is only those white walker dudes, you would never make it through unless you have a dragon, not without dying and becoming a white walker anyway"},{"key":"east","passable":false,"inspection":"The east is blocked off by a pile of rubble"},{"key":"south","passable":true,"part":1.3,"inspection":"he south passage is clear, leading to the exit"},{"key":"west","passable":false,"inspection":"The door is sealed shut, there is no way past now"}],"actions":[]},{"partId":1.12,"content":[{"narration":"The flames are intense and smoke is building, you start coughing."},{"narration":"You need to find a tool to unlock the door but there is nothing in this room."}],"movement":[{"key":"north","passable":false,"inspection":"To the north is only fire, you would never make it through, not without serious injuries anyway"},{"key":"east","passable":false,"inspection":"The east is blocked off by a pile of rubble"},{"key":"south","passable":true,"part":1.3,"inspection":"The south passage is clear, leading to the exit"},{"key":"west","passable":true,"part":1.1,"inspection":"The room to the west is clear and it looks like there is something on the floor"}],"actions":[]},{"partId":1.3,"content":[{"narration":"The exit is ahead, but the door is sealed shut"},{"narration":"You\'ll need to find a tool of some kind to unlock the door."}],"movement":[{"key":"north","passable":true,"part":"1.12","inspection":"North leads back where you started, but maybe you\'ll find a tool to open the door"},{"key":"east","passable":false,"inspection":"To the east is a  wall"},{"key":"south","passable":false,"inspection":"The exit door is ahead, but locked shut"},{"key":"west","passable":false,"inspection":"To the west is a solid wall"}],"actions":{"use":[{"key":"boomstick","event":"You use your boomstick to break the lock and the door swings open","loseItem":true,"part":2}]}},{"partId":2,"content":[{"narration":"That\'s it. You\'ve made it out of the room!"},{"narration":"You beat the dungeon master and escaped AmieDD 404 adventure! :)"}]}]}}');
go();   

        function go() {
          for (var i = 0, iLen = window.story.story.part.length; i < iLen; i++) {
            if (window.story.story.part[i].partId == part) {
              window.obj = window.story.story.part[i];
              break;
            }
          }
          narrative();
        }

$(document).on('keydown',function(e){
  var $target = $(e.target||e.srcElement);
  if(e.keyCode == 8 && !$target.is('input,[contenteditable="true"],textarea'))
  {
    e.preventDefault();
  }
});