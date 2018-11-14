const $ = require('jquery');
const fs = require("fs");
const Handlebars = require("handlebars");
const Expander = require("../util/expander");
const Licenses = require('../util/licensemanager');

const w_talentTemplate = fs.readFileSync(__dirname + "/../templates/wizards/pilot-talent-upgrade.hbs", "utf8");
const w_licenseTemplate = fs.readFileSync(__dirname + "/../templates/wizards/pilot-license-upgrade.hbs", "utf8");

const talents = require("../../resources/data/pilot_talents.json");


var selectedSkill;

function init(pilot) {

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

  //skills
  setSkillboxes(pilot);

  //talents 
  var selectableTalents = talents;
  
  for (var i = 0; i < selectableTalents.length; i++) {
    var pIdx = pilot.talents.findIndex(x => x.id === selectableTalents[i].id);
    
    if (pIdx > -1) {
      selectableTalents[i].pilot_rank = pilot.talents[pIdx].rank;
    } else {
      selectableTalents[i].pilot_rank = 0;
    }
  }

  selectableTalents = selectableTalents.filter(t => t.pilot_rank < 3);
 
  var talTemp = Handlebars.compile(w_talentTemplate);
  $("#talents-list").html(talTemp({ "talents": selectableTalents }));

  var talent_id = "";
  
  $('.talent-upg').click(function () {
    var e = $(this);
    $(`.wizard-btn[data-step='3']`).removeClass('disabled').addClass('btn');
    $('.talent-upg').each(function () {
      $(this).removeClass("skill-upgrade")
      if ($(this).closest('.equip-expander').hasClass('open')) {
        var parent = $(this).closest('.equip-expander');
        $(this).removeClass('bold');
        $(parent).removeClass('open');
        $($(parent).find(".equip-open-info")).hide("swing");
      }
    })
    e.addClass("skill-upgrade")   
    $("#selected-talent").html("Selected Talent: <b>" + e.data("talent-name") + "</b>");
    talent_id = e.data("talent");
  })

  //get license lists
  var licenseList = Licenses();

  //Licenses
  for (var i = 0; i < licenseList.length; i++) {
    var pIdx = pilot.licenses.findIndex(x => x.id === licenseList[i].id);

    if (pIdx > -1) {
      licenseList[i].pilot_rank = pilot.talents[pIdx].rank;
    } else {
      licenseList[i].pilot_rank = 0;
    }
  }

  licenseList = licenseList.filter(l => l.pilot_rank < 3 && l.source !== "GMS");

  var licenseTemp = Handlebars.compile(w_licenseTemplate);
  $("#licenses-list").html(licenseTemp({ "licenses": licenseList }));

  var license_id = "";



  Expander.bindEquipment();





}

function setSkillboxes(pilot) {
  $(`.wizard-btn[data-step='2']`).addClass('disabled').removeClass('btn');

  $('.skillbox').each(function () {
    var e = $(this);
    e.children('.subtitle').removeClass("skill-primary");
    e.addClass('selectable').removeClass("skill-upgrade");
    var skill = e.data("skill").toLowerCase();
    var skillVal = pilot.skills[skill];
    e.html(skill.toUpperCase());
    var skillClass = skillVal > 0 ? 'skill-bonus' : 'skill-malus';
    if (skillVal === 0) skillClass = '';
    e.append(`<br><span class="subtitle ${skillClass}">${skillVal > 0 ? '+' : ''}${skillVal}</span>`)

    if (skillVal > 3) {
      e.addClass("disabled").removeClass("selectable");
    } else {
      e.off();
      e.click(function () {
        if (selectedSkill) setSkillboxes(pilot)
        else(selectedSkill = skill.toLowerCase)
        $(`.wizard-btn[data-step='2']`).removeClass('disabled').addClass('btn');
        e.html(skill.toUpperCase());
        e.append(`<br><span class="subtitle skill-primary">${skillVal + 1 > 0 ? '+' : ''}${skillVal + 1}</span>`);
        e.addClass("skill-upgrade");
      });
    }
  });
}

module.exports.init = init