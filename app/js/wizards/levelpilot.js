const $ = require('jquery');
const fs = require("fs");
const Handlebars = require("handlebars");
const Expander = require("../util/expander");
const Licenses = require('../util/licensemanager');

const w_talentTemplate = fs.readFileSync(__dirname + "/../templates/wizards/pilot-talent-upgrade.hbs", "utf8");
const w_licenseTemplate = fs.readFileSync(__dirname + "/../templates/wizards/pilot-license-upgrade.hbs", "utf8");
const w_coreskillsTemplate = fs.readFileSync(__dirname + "/../templates/wizards/pilot-coreskills.hbs", "utf8");

const talents = require("../../resources/data/pilot_talents.json");
const coreskills = require("../../resources/data/core_bonus.json");


var selectedSkill;
var selectedHASE;
var core_skill_id;

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

  //corebonuses
  setCoreboxes(pilot);

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
    var pIdx = pilot.licenses.findIndex(x => x.name === licenseList[i].name);

    if (pIdx > -1) {
      licenseList[i].pilot_rank = pilot.licenses[pIdx].rank;
    } else {
      licenseList[i].pilot_rank = 0;
    }
  }

  licenseList = licenseList.filter(l => l.pilot_rank < 3 && l.source !== "GMS");


  var licenseTemp = Handlebars.compile(w_licenseTemplate);
  $("#licenses-list").html(licenseTemp({ "licenses": licenseList }));

  var newLicense;
  $('.license-upg').click(function () {
    var e = $(this);
    if ((pilot.level + 1) % 3 === 0) $(`.wizard-btn[data-step='4']`).removeClass('disabled').addClass('btn');
    else $(`.wizard-btn[data-step='5']`).removeClass('disabled').addClass('btn');
    $('.license-upg').each(function () {
      $(this).removeClass("skill-upgrade")
      if ($(this).closest('.equip-expander').hasClass('open')) {
        var parent = $(this).closest('.equip-expander');
        $(this).removeClass('bold');
        $(parent).removeClass('open');
        $($(parent).find(".equip-open-info")).hide("swing");
      }
    })
    e.addClass("skill-upgrade")
    $("#selected-license").html(`Selected: <b>${e.data("name")} // ${e.data("level")}</b>`);
    newLicense = {
      name: e.data("name"),
      source: e.data("source"),
      level: e.data("level")
    },
    setCoreSkills(pilot, e.data("source"));
  })

  
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
        else(selectedSkill = skill.toLowerCase())
        $(`.wizard-btn[data-step='2']`).removeClass('disabled').addClass('btn');
        e.html(skill.toUpperCase());
        e.append(`<br><span class="subtitle skill-primary">${skillVal + 1 > 0 ? '+' : ''}${skillVal + 1}</span>`);
        e.addClass("skill-upgrade");
      });
    }
  });
}

function setCoreboxes(pilot) {
  $(`.wizard-btn[data-step='2']`).addClass('disabled').removeClass('btn');

  $('.core-skillbox').each(function () {
    var e = $(this);   
    var hase = e.data("hase");   
    var haseVal = pilot.core[hase];
    e.children('.subtitle').removeClass("skill-primary");
    e.addClass('selectable').removeClass("skill-upgrade");
    e.html(hase.toUpperCase());
    var haseClass = haseVal > 0 ? 'skill-bonus' : 'skill-malus';
    if (haseVal === 0) haseClass = '';
    e.append(`<br><span class="hase-num ${haseClass}">${haseVal > 0 ? '+' : ''}${haseVal}</span>`)

    if (haseVal > 6) {
      e.addClass("disabled").removeClass("selectable");
    } else {
      e.off();
      e.click(function () {
        if (selectedHASE) setCoreboxes(pilot)
        else(selectedHASE = hase.toLowerCase())
        $(`.wizard-btn[data-step='3']`).removeClass('disabled').addClass('btn');
        e.html(hase.toUpperCase());
        e.append(`<br><span class="hase-num skill-primary">${haseVal + 1 > 0 ? '+' : ''}${haseVal + 1}</span>`);
        e.addClass("skill-upgrade");
      });
    }
  });
}


function setCoreSkills(pilot, addedLicenseSource) {
  //TODO: refactor
  //get array of license sources and levels
  var larr = [];
  for (let i = 0; i < pilot.licenses.length; i++) {
    var l = pilot.licenses[i];
    larr.push({
      key: l.source,
      val: l.level
    })
  }
  larr.push({key: addedLicenseSource, val: 1});

  //sum levels by source
  var lls = {};
  for (let i = 0; i < larr.length; i++) {
    var l = larr[i];
    if (lls[l.key]) lls[l.key] += l.val
    else lls[l.key] = l.val;
  }
  //find all sources with level sums >= 3 (and GMS)
  var availableSources = ["GMS"];
  for (var l in lls) {
    if (lls[l] >= 3) availableSources.push(l);
  }

  var selectableCBs = coreskills.filter(x => availableSources.includes(x.source));

  var cbTemp = Handlebars.compile(w_coreskillTemplate);
  $("#coreskills-list").html(cbTemp({"skills": selectableCBs}));

  $('.coreskill-upg').click(function () {
    var e = $(this);
    $(`.wizard-btn[data-step='5']`).removeClass('disabled').addClass('btn');
    $('.coreskill-upg').each(function () { $(this).removeClass("skill-upgrade");})
    e.addClass("skill-upgrade")
    $("#selected-coreskill").html(`Selected: <b>${e.data("name")}</b>`);
    core_skill_id = e.data("id");
  })

}


module.exports.init = init