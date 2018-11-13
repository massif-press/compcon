const { dialog } = require('electron').remote;
const $ = require("jquery");
const fs = require("fs");
const Tags = require("../util/taghelper")
const Handlebars = require("handlebars");
const Expander = require("../util/expander");
const Sidebar = require("../pilot-sidebar");
//templates
const w_backgroundTemplate = fs.readFileSync(__dirname + "/../templates/wizards/pilot-background.hbs", "utf8");
const w_talentTemplate = fs.readFileSync(__dirname + "/../templates/wizards/pilot-talents.hbs", "utf8");
const w_weaponTemplate = fs.readFileSync(__dirname + "/../templates/wizards/pilot-weapons.hbs", "utf8");
const w_armorTemplate = fs.readFileSync(__dirname + "/../templates/wizards/pilot-armor.hbs", "utf8");
const w_gearTemplate = fs.readFileSync(__dirname + "/../templates/wizards/pilot-gear.hbs", "utf8");
//data
const backgrounds = require("../../resources/data/backgrounds.json");
const talents = require("../../resources/data/pilot_talents.json");
const weapons = require("../../resources/data/pilot_gear.json").weapons.filter(x => x.rarity === 0);
Tags.expand(weapons);
const armor = require("../../resources/data/pilot_gear.json").armor.filter(x => x.rarity === 0);
const gear = require("../../resources/data/pilot_gear.json").gear.filter(x => x.rarity === 0);

function init() {

  $('.wizard-btn').off();
  $('.wizard-btn').click(function () {
    if ($(this).hasClass('disabled')) return;
    let step = $(this).data("step");
    $(".np-wizard").hide()
    $(`.np-wizard[data-step='${step}']`).show();
  });

  $('.close').click(function () {
    let modalID = $(this).data("modal");
    $('#' + modalID).css("display", "none");
  });

  //name
  $("line-input").off();
  $('.line-input').keyup(function () {
    if ($('#callsign-input').val().length && $('#name-input').val().length) $(`.wizard-btn[data-step='2']`).removeClass('disabled').addClass('btn');
    else $(`.wizard-btn[data-step='2']`).addClass('disabled').removeClass('btn');
  })

  var selectedBackground;
  //Backgrounds
  var bgTemp = Handlebars.compile(w_backgroundTemplate);
  $("#bg-options").html(bgTemp({ "backgrounds": backgrounds }));

  $('.bg-selector').off()
  $('.bg-selector').click(function () {
    var element = $(this);

    $('.bg-selector').each(function () {
      e = $(this);
      // e.removeClass('selected')
      if (e !== element && e.hasClass('selected')) {
        e.toggleClass('selected');
        e.toggleClass('sweep-btn bold');
        var parent = e.closest('.equip-expander');
        $($(parent).find(".equip-open-info")).toggle("swing");
      }
    });

    $(this).addClass('selected');
    $('#bg-selection').html(`<b>"${$(this).data("name")}"</b> Selected`);
    $(`.wizard-btn[data-step='3']`).removeClass('disabled').addClass('btn');
    selectedBackground = backgrounds.find(x => x.id === $(this).data("id"));
    setSkillsArray(selectedBackground.skills)
  });

  //Skills
  var selectedSkills = {};
  function setSkillsArray(skillsArray) {
    $("#skill-instruction").text("Select Primary Skill")
    $("#skill-instruction-sub").text("Selected skill gains a +2 skill bonus. The other skills gain a +1 bonus.")
    $(`.wizard-btn[data-step='4']`).addClass('disabled').removeClass('btn');

    selectedSkills = {};
    var selectables = [];
    var allSkills = [];
    $('.skillbox').each(function () {
      allSkills.push($(this));
      $(this).html($(this).data("skill").toUpperCase());
      $(this).removeClass('skill-primary skill-bonus skill-malus');
      $(this).css("cursor", "pointer");
      var skillIdx = skillsArray.findIndex(x => x === $(this).data("skill"));
      //disable all non-bg aligned skills
      if (skillIdx === -1) {
        $(this).addClass("disabled");
      } else {
        //make all bg skills clickable
        $(this).addClass("selectable");
        var clickable = $(this);
        selectables.push(clickable);
        clickable.off();
        //bind clickable skills
        clickable.click(function () {
          for (let i = 0; i < selectables.length; i++) {
            var e = selectables[i];
            var id = e.data("skill").toLowerCase();
            //remove selectables from allskills
            allSkills.splice(allSkills.findIndex(x => x.data("skill") === e.data("skill")), 1);
            //on click, assign primary skill
            if (e.data("skill") === $(this).data("skill")) {
              e.addClass("skill-primary").removeClass("selectable");
              e.append('<br><span class="subtitle skill-primary">+2</span>')
              selectedSkills[id] = 2;
            } else {
              //assign secondary skills
              e.addClass("skill-bonus").removeClass("selectable");
              e.append('<br><span class="subtitle skill-bonus">+1</span>')
              selectedSkills[id] = 1;
            }
            e.off();
          }

          //replace selectables with remaining skills
          selectables = allSkills;
          $("#skill-instruction").text("Select Additional Skill")
          $("#skill-instruction-sub").text("Selected skill gains a +1 Bonus")

          //set this so we only have to bind one more time
          currentClick = 0;
          clicked = [];

          //make remaining skills clickable           
          for (let j = 0; j < selectables.length; j++) {
            e = selectables[j];
            e.removeClass('disabled').addClass('selectable');
            e.off();
            e.click(function () {
              var clicked = $(this);
              if (!clicked.hasClass("selectable")) return;
              var id = clicked.data("skill").toLowerCase();
              clicked.removeClass('selectable');
              //first click == add bonus
              if (currentClick === 0) {
                currentClick++;
                $("#skill-instruction").text("Select Weakness")
                $("#skill-instruction-sub").text("Select a skill at a -1 malus. (1/2)")
                clicked.addClass("skill-bonus");
                clicked.append('<br><span class="subtitle skill-bonus">+1</span>')
                selectedSkills[id] = 1;
              } else {  //add malus
                currentClick++;
                $("#skill-instruction").text("Select Weakness")
                $("#skill-instruction-sub").text("Select another skill at a -1 malus. (2/2)")
                clicked.addClass("skill-malus");
                clicked.append('<br><span class="subtitle skill-malus">-1</span>')
                selectedSkills[id] = -1;
                if (currentClick == 3) {
                  $('.skillbox').off(); //stop selection
                  $('.skillbox').css("pointer", "default");
                  $("#skill-instruction").text("Skills")
                  $("#skill-instruction-sub").text("Skill selection complete")
                  $(`.wizard-btn[data-step='4']`).removeClass('disabled').addClass('btn');
                }
              }
            })
          }
        })
      }
    })
  }

  $("#skill-reset").off()
  $("#skill-reset").click(function () { setSkillsArray(selectedBackground.skills) });

  //Talents 
  var talTemp = Handlebars.compile(w_talentTemplate);
  $("#talents-list").html(talTemp({ "talents": talents }));
  // Expander.bindEquipment();

  var talent_selections = [];
  var talent_names = [];
  $('.talent-btn').click(function () {
    var e = $(this);
    var add = e.children(".add-button");
    var remove = e.children(".subtract-button");
    if (add.is(':visible') && talent_selections.length < 3) {
      talent_selections.push(e.data("talent"));
      talent_names.push(e.data("talent-name"));
      add.hide();
      remove.show();
    } else if (remove.is(':visible')) {
      talent_selections.pop(talent_selections.findIndex(x => x === e.data("talent")));
      talent_names.pop(talent_selections.findIndex(x => x === e.data("talent-name")));
      remove.hide();
      add.show();
    }
    $("#selected-talents").html("Selected Talents: <b>" + talent_names.join(", ") + "</b>");
    if (talent_selections.length === 3) {
      $(`.wizard-btn[data-step='5']`).removeClass('disabled').addClass('btn');
      $('.talent-btn').each(function () { $(this).find(".add-button").addClass('off') });
    } else {
      $(`.wizard-btn[data-step='5']`).addClass('disabled').removeClass('btn');
      $('.talent-btn').each(function () { $(this).find(".add-button").removeClass('off') });
    }
    $("#talents-remaining").html(`(<b>${3 - talent_selections.length}</b> Remaining)`)
  })

  //Gear 
  var weaponTemp = Handlebars.compile(w_weaponTemplate);
  $("#pilot-weapons-list").html(weaponTemp({ "items": weapons }));
  var armorTemp = Handlebars.compile(w_armorTemplate);
  $("#pilot-armor-list").html(armorTemp({ "items": armor }));
  var gearTemp = Handlebars.compile(w_gearTemplate);
  $("#pilot-gear-list").html(gearTemp({ "items": gear }));
  Expander.bindEquipment();

  var weapon_selections = [];
  var armor_selections = [];
  var other_selections = [];
  var gear_selections = [];

  $("#pilot-weapons-list").show();

  $("#gear-gear-btn").off();
  $("#gear-gear-btn").click(function () {
    $("#starting-gear-list").html("Selected Gear: <b>" + other_selections.join(", ") + "</b>");
    $("#gear-armor-btn, #gear-weapons-btn").removeClass("selected");
    $(this).addClass("selected");
    $("#pilot-weapons-list, #pilot-armor-list").hide();
    $("#pilot-gear-list").show()
  });

  $("#gear-armor-btn").off();
  $("#gear-armor-btn").click(function () {
    $("#starting-gear-list").html("Selected Gear: <b>" + armor_selections.join(", ") + "</b>");
    $("#gear-gear-btn, #gear-weapons-btn").removeClass("selected");
    $(this).addClass("selected");
    $("#pilot-weapons-list, #pilot-gear-list").hide();
    $("#pilot-armor-list").show()
  });

  $("#gear-weapons-btn").off();
  $("#gear-weapons-btn").click(function () {
    $("#starting-gear-list").html("Selected Gear: <b>" + weapon_selections.join(", ") + "</b>");
    $("#gear-armor-btn, #gear-gear-btn").removeClass("selected");
    $(this).addClass("selected");
    $("#pilot-gear-list, #pilot-armor-list").hide();
    $("#pilot-weapons-list").show()
  });

  $('.pilot-weapon-btn').off();
  $('.pilot-weapon-btn').click(function () {
    var e = $(this);
    var add = e.children(".add-button");
    var remove = e.children(".subtract-button");
    if (add.is(':visible') && weapon_selections.length < 2) {
      gear_selections.push(e.data("item"));
      weapon_selections.push(e.data("item-name"));
      add.hide();
      remove.show();
      if (weapon_selections.length == 2) {
        $('.pilot-weapon-btn').each(function () { $(this).find(".add-button").addClass('off') });
      }
    } else if (remove.is(':visible')) {
      gear_selections.pop(gear_selections.findIndex(x => x === e.data("item")));
      weapon_selections.pop(weapon_selections.findIndex(x => x === e.data("item-name")));
      remove.hide();
      add.show();
      if (weapon_selections.length < 2) {
        $('.pilot-weapon-btn').each(function () { $(this).find(".add-button").removeClass('off') });
      }
    }
    $("#weapons-select-sub").text(weapon_selections.length + "/2");
    $("#starting-gear-list").html("Selected Gear: <b>" + weapon_selections.join(", ") + "</b>");
  });

  $('.pilot-armor-btn').off();
  $('.pilot-armor-btn').click(function () {
    var e = $(this);
    var add = e.children(".add-button");
    var remove = e.children(".subtract-button");
    if (add.is(':visible') && armor_selections.length < 1) {
      gear_selections.push(e.data("item"));
      armor_selections.push(e.data("item-name"));
      add.hide();
      remove.show();
      if (armor_selections.length == 1) {
        $('.pilot-armor-btn').each(function () { $(this).find(".add-button").addClass('off') });
      }
    } else if (remove.is(':visible')) {
      gear_selections.pop(gear_selections.findIndex(x => x === e.data("item")));
      armor_selections.pop(armor_selections.findIndex(x => x === e.data("item-name")));
      remove.hide();
      add.show();
      if (armor_selections.length < 1) {
        $('.pilot-armor-btn').each(function () { $(this).find(".add-button").removeClass('off') });
      }
    }
    $("#armor-select-sub").text(armor_selections.length + "/1");
    $("#starting-gear-list").html("Selected Gear: <b>" + armor_selections.join(", ") + "</b>");
  });


  $('.pilot-gear-btn').off();
  $('.pilot-gear-btn').click(function () {
    var e = $(this);
    var add = e.children(".add-button");
    var remove = e.children(".subtract-button");
    if (add.is(':visible') && other_selections.length < 3) {
      gear_selections.push(e.data("item"));
      other_selections.push(e.data("item-name"));
      add.hide();
      remove.show();
      if (other_selections.length == 3) {
        $('.pilot-gear-btn').each(function () { $(this).find(".add-button").addClass('off') });
      }
    } else if (remove.is(':visible')) {
      gear_selections.pop(gear_selections.findIndex(x => x === e.data("item")));
      other_selections.pop(other_selections.findIndex(x => x === e.data("item-name")));
      remove.hide();
      add.show();
      if (other_selections.length < 3) {
        $('.pilot-gear-btn').each(function () { $(this).find(".add-button").removeClass('off') });
      }
    }
    $("#gear-select-sub").text(other_selections.length + "/3");
    $("#starting-gear-list").html("Selected Gear: <b>" + other_selections.join(", ") + "</b>");
  });

  //details
  var portraitPath = "";
  var appearancePath = "";

  $('#portrait-select').off()
  $('#portrait-select').click(function () {
    var filepath = dialog.showOpenDialog({
      defaultPath: __dirname + "../resources/img/pilots",
      title: "Select Portrait Image",
      filters: [
        { name: 'Images', extensions: ['jpg', 'png', 'gif', 'bmp', 'jpeg'] }
      ],
      properties: ['openFile']
    });

    if (filepath) {
      portraitPath = filepath[0];
      $("#portait-filename").text(filepath[0].split('\\').pop().split('/').pop());
    };
  });

  $('#appearance-select').off()
  $('#appearance-select').click(function () {
    var filepath = dialog.showOpenDialog({
      defaultPath: __dirname + "../resources/img/pilots",
      title: "Select Pilot Image",
      filters: [
        { name: 'Images', extensions: ['jpg', 'png', 'gif', 'bmp', 'jpeg'] }
      ],
      properties: ['openFile']
    });

    if (filepath) {
      appearancePath = filepath[0];
      $("#appearance-filename").text(filepath[0].split('\\').pop().split('/').pop());
    };
  });

  //fnf
  var fnf = 0;
  $("#fnf-add").off()
  $("#fnf-add").click(function () {
    $('#fnf-items').append(
      `<div class="fnf-item" data-idx="${fnf}">
        <input class="line-input" id="fnf-name" type="text" placeholder="Name...">
        <input class="line-input" id="fnf-relationship" type="text" placeholder=" Relationship..."><br>
        <textarea class="wizard-textarea" id="fnf-notes" name="appearance" rows="3" cols="55" spellcheck="true" style="margin-left:3%" placeholder=" Appearance description..."></textarea>
        <br>
        <div data-idx="${fnf}" class="fnf-remove minor-btn btn pull-right" style="display: inline; color:var(--burn);">REMOVE</div>
        <br>
        <hr>
      </div>`
    )
    $(`#fnf-remove[data-idx='${fnf}']`).off()
    $(`.fnf-remove`).click(function () {
      $(`.fnf-item[data-idx='${$(this).data('idx')}']`).remove();
    })
    fnf++;
  })

  $("#pilot-complete-btn").off();
  $("#pilot-complete-btn").click(function () {
    var pilot = getNewPilot();
    pilot.name = $("#name-input").val();
    pilot.callsign = $("#callsign-input").val();
    pilot.background = selectedBackground.name;
    for (var s in selectedSkills) {
      pilot.skills[s] = selectedSkills[s];
    }
    pilot.talents = getTalentArray(talent_selections);
    pilot.gear = getGearArray(gear_selections);
    pilot.history = $("#pilot-history").val();
    pilot.notes = $("#pilot-notes").val();
    pilot.text_appearance = $("#pilot-appearance").val();
    pilot.fnf = getFnfArray();
    pilot.img_portrait = portraitPath;
    pilot.img_appearance = appearancePath;

    $('#newPilotModal').css("display", "none");
    Sidebar.init(pilot);
  })

}

function getFnfArray() {
  var fnf = []
  $('.fnf-item').each(function(){
    var e = $(this);
    fnf.push({
      name: e.children("#fnf-name").val(),
      relationship: e.children("#fnf-relationship").val(),
      description: e.children("#fnf-notes").val(),
    })
  })
  return fnf;
}

function getTalentArray(arr) {
  var tal = [];
  for (var i = 0; i < arr.length; i++) {
    tal.push({
      id: arr[i],
      rank: 1
    });
  }
  return tal;
}

function getGearArray(arr) {
  var gear = [];
  for (var i = 0; i < arr.length; i++) {
    gear.push({
      id: arr[i],
      notes: ""
    });
  }
  return gear;
}

function getNewPilot() {
  return {
    "id": Math.random().toString(36).substr(2, 9),
    "callsign": "NEW",
    "name": "New Pilot",
    "level": 0,
    "background": "N/A",
    "fnf": [],
    "hp_bonus": 0,
    "armor": 0,
    "ee": "10/10",
    "speed": 4,
    "status": "ACTIVE",
    "licenses": [],
    "gear": [],
    "skills": { "grit": 0, "acquire": 0, "brawl": 0, "flash": 0, "infiltrate": 0, "investigate": 0, "persuade": 0, "command": 0, "swindle": 0, "tech": 0, "survive": 0, "maneuver": 0, "notice": 0 },
    "talents": [],
    "talent_weapons": [],
    "core": { "hull": 0, "agi": 0, "eng": 0, "sys": 0, "targeting": 0, "hp": 0, "sp": 0, "core_sp": 0 },
    "core_bonuses": [],
    "configs": [],
    "notes": ""
  }
}


module.exports.init = init;