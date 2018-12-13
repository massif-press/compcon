const $ = require('jquery');
const fs = require("fs");
const Handlebars = require("handlebars");
const io = require("../util/io");
const Expander = require("../util/expander");
const Modal = require("../util/modal");
const LicenseManager = require('../util/licensemanager');
const PilotSidebar = require('../pilot-sidebar');
const Stats = require('../util/stats');

const w_talentTemplate = io.readTemplate('wizards/pilot-talent-upgrade');
const w_licenseTemplate = io.readTemplate('wizards/pilot-license-upgrade');
const w_coreskillTemplate = io.readTemplate('wizards/pilot-coreskills');

const talents = require("../../extraResources/data/pilot_talents.json");
const coreskills = require("../../extraResources/data/core_bonus.json");

var selectedSkill;
var selectedHASE;
var newTalent;
var newLicense;
var newCoreskill;

function init(pilot) {
  selectedSkill = "";
  selectedHASE = "";
  newTalent = {};
  newLicense = {};
  newCoreskill = {};

  $('.wizard-btn').off();
  $('.wizard-btn').click(function () {
    if ($(this).hasClass('disabled')) return;
    let step = $(this).data("step");
    $(".np-wizard").hide()
    $(`.np-wizard[data-step='${step}']`).show();
  });

  Expander.bindModalClose()

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
  $("#level-talents-list").html(talTemp({ "talents": selectableTalents }));

  $('.talent-upg').click(function () {
    var e = $(this);
    $(`.wizard-btn[data-step='4']`).removeClass('disabled').addClass('btn');
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
    newTalent = {
      id: e.data("talent"),
      name: e.data("talent-name"),
      rank: e.data("upg-rank")
    };
  })

  //get license lists
  var licenseList = LicenseManager.getLicenseList();

  //Licenses
  for (var i = 0; i < licenseList.length; i++) {
    var pIdx = pilot.licenses.findIndex(x => x.name === licenseList[i].name);

    if (pIdx > -1) {
      licenseList[i].pilot_rank = pilot.licenses[pIdx].level;
    } else {
      licenseList[i].pilot_rank = 0;
    }
  }

  licenseList = licenseList.filter(l => l.pilot_rank < 3 && l.source !== "GMS");

  var licenseTemp = Handlebars.compile(w_licenseTemplate);
  $("#licenses-list").html(licenseTemp({ "licenses": licenseList }));

  $('.license-upg').click(function () {
    var e = $(this);
    if ((pilot.level + 1) % 3 === 0) $(`.wizard-btn[data-step='5']`).removeClass('disabled').addClass('btn');
    else $(`.wizard-btn[data-step='6']`).removeClass('disabled').addClass('btn');
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

  $(`.wizard-btn[data-step='6']`).click(function() {
    if ($(this).hasClass('btn'))
      $("#results-table").html(setResultsTable(pilot))
  });

  Expander.bindEquipment();

  Expander.bindCarets();

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
  $(`.wizard-btn[data-step='3']`).addClass('disabled').removeClass('btn');

  $('.core-skillbox').each(function () {
    var e = $(this);   
    var hase = e.data("hase");   
    var haseVal = pilot.core[hase];
    e.children('.subtitle').removeClass("skill-primary");
    e.addClass('selectable').removeClass("skill-upgrade");
    e.html(`<span class="core-name">${e.data("name")}</span>`);
    var haseClass = haseVal > 0 ? 'skill-bonus' : 'skill-malus';
    if (haseVal === 0) haseClass = '';
    e.append(`<br><span class="core-skillbox-num ${haseClass}">${haseVal > 0 ? '+' : ''}${haseVal}</span>`)

    if (haseVal > 6) {
      e.addClass("disabled").removeClass("selectable");
    } else {
      e.off();
      e.click(function () {
        if (selectedHASE) setCoreboxes(pilot)
        else(selectedHASE = hase.toLowerCase())
        $(`.wizard-btn[data-step='3']`).removeClass('disabled').addClass('btn');
        e.html(`<span class="core-name">${e.data("name")}</span>`);
        e.append(`<br><span class="core-skillbox-num skill-primary">${haseVal + 1 > 0 ? '+' : ''}${haseVal + 1}</span>`);
        e.addClass("skill-upgrade");
      });
    }
  });
}


function setCoreSkills(pilot, addedLicenseSource) {
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

  var selectableCBs = coreskills.filter(x => availableSources.includes(x.source) && !pilot.core_bonuses.includes(x.id));

  var cbTemp = Handlebars.compile(w_coreskillTemplate);
  $("#coreskills-list").html(cbTemp({"skills": selectableCBs}));

  $('.coreskill-upg').click(function () {
    var e = $(this);
    $(`.wizard-btn[data-step='6']`).removeClass('disabled').addClass('btn');
    $('.coreskill-upg').each(function () { $(this).removeClass("skill-upgrade");})
    e.addClass("skill-upgrade")
    $("#selected-coreskill").html(`Selected: <b>${e.data("name")}</b>`);
    newCoreskill = {
      id: e.data("id"),
      name: e.data("name")
    };
  })
}

function setResultsTable(pilot) {
  var leveledPilot = getLeveledPilot(pilot); 

  var talHtml = newTalent.rank === 1
    ? `<span class="newval">${newTalent.name} </span><span class="subtitle">UNLOCKED</span></span>`
    : `${newTalent.name} <span class="oldval">${newTalent.rank}</span><span class="subtitle" style="vertical-align: super;">>></span><span class="newval">${newTalent.rank + 1}</span>`; 

  var licHtml = newLicense.level === 1
    ? `<span class="newval">${newLicense.name} </span><span class="subtitle">UNLOCKED</span></span>`
    : `${newLicense.name} <span class="oldval">${newLicense.level}</span><span class="subtitle" style="vertical-align: super;">>></span><span class="newval">${newLicense.level + 1}</span>`; 

  var t = `
    <table id="level-results">
      <tr>
        <th width="16.6%">Pilot Base HP</th>
        <th width="16.6%">Pilot ${selectedSkill.toUpperCase()}</th>
        ${leveledPilot.level % 3 === 0 ? `<th width="16.6%">Pilot GRIT</th>` : ''}
        <th width="16.6%">CORE HP</th>
        <th width="16.6%">CORE ${selectedHASE.toUpperCase()}</th>
        ${leveledPilot.level % 2 === 0 ? `<th width="16.6%">CORE Targeting</th>` : ''}
      </tr>
      <tr>
        <td style="text-align:center"><span class="oldval">${Stats.getPilotHP(pilot.level)}</span><span class="subtitle" style="vertical-align: super;">>></span><span class="newval">${leveledPilot.hp}</span></td>
        <td style="text-align:center"><span class="oldval">${pilot.skills[selectedSkill]}</span><span class="subtitle" style="vertical-align: super;">>></span><span class="newval">${pilot.skills[selectedSkill] + 1}</span></td>
        ${leveledPilot.level % 3 === 0 ? `<td style="text-align:center"><span class="oldval">${pilot.skills.grit}</span><span class="subtitle" style="vertical-align: super;">>></span><span class="newval">${pilot.skills.grit +1}</span></td>` : ''}
        <td style="text-align:center"><span class="oldval">${pilot.core.hp}</span><span class="subtitle" style="vertical-align: super;">>></span><span class="newval">${pilot.core.hp + 1}</span></td>
        <td style="text-align:center"><span class="oldval">${pilot.core[selectedHASE]}</span><span class="subtitle" style="vertical-align: super;">>></span><span class="newval">${pilot.core[selectedHASE] + 1}</span></td>
        ${leveledPilot.level % 2 === 0 ? `<td style="text-align:center"><span class="oldval">${pilot.core.targeting}</span><span class="subtitle" style="vertical-align: super;">>></span><span class="newval">${pilot.core.targeting + 1}</span></td>` : ''}
      </tr>
      <tr>
        <th colspan="3">Talent Upgrade</th>
        <th colspan="3">License Upgrade</th>
      </tr>
      <tr>
        <td style="text-align:center" colspan="3">${talHtml}</td>
        <td style="text-align:center" colspan="3">${licHtml}</td>
      </tr>`

    if (newCoreskill && newCoreskill.id) {
      t += `      
      <tr>
        <th colspan="6">Core Skill Unlocked</th>
      </tr>
      <tr>
        <td style="text-align:center" colspan="6"><span class="newval">${newCoreskill.name}</span></td>
      </tr>`
    }

    t += '</table>'

    $("#confirm-level-up").off();
    $("#confirm-level-up").click(function(){
      applyCoreBonusExtras();
      PilotSidebar.update(leveledPilot);
      $('#levelPilotModal').css("display", "none");
    })

  return t;
}

function getLeveledPilot(pilot) {
  var lp = Object.assign({}, pilot);;
  lp.hp = Stats.getPilotHP(pilot.level)
  lp.level ++;
  lp.hp ++;
  lp.skills[selectedSkill] ++;
  if (lp.level % 3 === 0) lp.skills.grit ++
  lp.core[selectedHASE] ++;
  lp.core["hp"] ++;
  if (lp.level % 2 === 0 && lp.core.targeting < 6) lp.core.targeting ++
  var talentIndex = lp.talents.findIndex(x => x.id === newTalent.id);
  if (talentIndex === -1) {
    lp.talents.push({
      id: newTalent.id,
      rank: newTalent.rank
    })
  } else {
    lp.talents[talentIndex].rank ++;
  }
  var licenseIndex = lp.licenses.findIndex(x => x.name === newLicense.name);
  if (licenseIndex === -1) {
    lp.licenses.push(newLicense)
  } else {
    lp.licenses[licenseIndex].level ++;
  }
  if (newCoreskill && newCoreskill.id) {
    lp.core_bonuses.push(newCoreskill.id)
  }

  return lp;
}

//TODO: open modal and return mount index and mod id
function applyCoreBonusExtras(pilot) {
  if (!newCoreskill || !newCoreskill.id) return;
  var id = newCoreskill.id;
  if (id !== "hardpoints" || id !== "burnout" || id !== "intweapon") return;

  var data = {};
  Modal.getSelectorModal("mount-selector", data, function (result) {
    if (result) {
      pilot.mount
      //assign mod to mount
    }
  })
}


module.exports.init = init