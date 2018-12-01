const $ = require('jquery');
const fs = require('fs');
const Handlebars = require('handlebars');
const Stats = require('./util/stats');
const Tags = require('./util/taghelper');
const Charts = require('./util/chartbuilder');
const Expander = require('./util/expander');
const Search = require('./util/search');
const mechSidebar = require("./mech-sidebar");
//data
const shells = require("../resources/data/shells.json");
const weapons = require("../resources/data/weapons.json");
const systems = require("../resources/data/systems.json");
const weapon_mods = require("../resources/data/mods.json");
const configurations = require("../resources/data/configurations.json");
//templates
const loadoutTemplate = fs.readFileSync(__dirname + "/templates/mech-loadout.hbs", "utf8");
const infoTemplate = fs.readFileSync(__dirname + "/templates/mech-info.hbs", "utf8");
const statsTemplate = fs.readFileSync(__dirname + "/templates/mech-stats.hbs", "utf8");
const shellModalTemplate = fs.readFileSync(__dirname + "/templates/mech-shell-modal.hbs", "utf8");
const equipModalTemplate = fs.readFileSync(__dirname + "/templates/editors/mount-editor.hbs", "utf8");
const systemModalTemplate = fs.readFileSync(__dirname + "/templates/editors/system-editor.hbs", "utf8");
const equipWeaponItemTemplate = fs.readFileSync(__dirname + "/templates/editors/mech-weapon.hbs", "utf8");
const systemItemTemplate = fs.readFileSync(__dirname + "/templates/editors/mech-system.hbs", "utf8");
const modModalTemplate = fs.readFileSync(__dirname + "/templates/editors/mod-editor.hbs", "utf8");
// const modItem = fs.readFileSync(__dirname + "/templates/editors/mech-mod.hbs", "utf8");

function loadMech(config, pilot) {

   //presort mounts
  config.mounts.sort(function (a, b) {
    var sortOrder = {
      "Main": 0,
      "Core": 1,
      "Auxiliary": 2,
      "Flex": 3,
      "Heavy": 4,
      "Superheavy": 5,
      "Special": 6,
      "Apocalypse": 7
    }
    return sortOrder[a.mount] < sortOrder[b.mount] ? -1 : sortOrder[a.mount] > sortOrder[b.mount] ? 1 : 0;
  })

  config.shell = Search.byID(shells, config.shell_id);

  config.shell.ult_active = Tags.parse(config.shell.ult_active);

  $(".main-scroll").scrollTop(1);
  var stats = Stats.getMechStats(config, pilot)

  var mounts = [];
  var sys = [];
  
  //add ult wewapon, if any
  if (config.shell.ult_passive_weapon) {
    var w = Search.byID(weapons, config.shell.ult_passive_weapon);
    w.isUnique = true;
    mounts.push({
      mount: w.mount,
      weapon: Tags.expand(w),
      mod_ids: [],
      specialMount: "Ultimate Weapon"
    });
  }

  //add pilot talent weapons, if any
  if (pilot.talent_weapons) {
    for (var i = 0; i < pilot.talent_weapons.length; i++) {
      var w = Search.byID(weapons, pilot.talent_weapons[i]);
      w.isUnique = true;
      mounts.push({
        mount: w.mount,
        weapon: Tags.expand(w),
        mod_ids: [],
        specialMount: "Talent Weapon"
      });
    }
  }
 
  //add weapons, per mount
  for (var i = 0; i < config.mounts.length; i++) {
    if (!config.mounts[i].weapon_id) {
      mounts.push({
        mount: config.mounts[i].mount,
        sh_lock: config.mounts[i].sh_lock || null
      })

    } else {
      var w = Search.byID(weapons, config.mounts[i].weapon_id)
      if (w.tags.findIndex(t => t.id === "unique") > -1) w.isUnique = true;
      var mods = config.mounts[i].mods ? config.mounts[i].mods : []; 
      mounts.push({
        mount: config.mounts[i].mount,
        weapon: Tags.expand(w),
        mod_ids: mods
      });
    }
  }


  //TODO: walk through core bonuses, talents, to add add linked mods (global_mods in pilot data?)
  //some mods only apply to eg. ranged or limited systems/items.

  for (let i = 0; i < mounts.length; i++) {
    if (mounts[i].mod_ids == null) continue;
    var hydratedMods = [];
    var modSP = 0;
    for (let j = 0; j < mounts[i].mod_ids.length; j++) {
      var m_id = mounts[i].mod_ids[j];
      var newMod = Search.byID(weapon_mods, m_id);
      newMod.effect = Tags.parse(newMod.effect);
      modSP += newMod.sp;
      hydratedMods.push(newMod)
    }
    mounts[i].mods = hydratedMods;
    mounts[i].modSP = modSP;
  }

  for (var i = 0; i < config.systems.length; i++) {
    var s = Tags.expand(Search.byID(systems, config.systems[i].id));
    if (s.tags.findIndex(t => t.id === "unique") > -1) s.isUnique = true;
    if (s.tags.findIndex(t => t.type === "AI") > -1) s.isAi = true;
    sys.push(s);
  }

  var tp = pilot.talents.find(x=>x.id === "techno");
  if (tp) {
    var ai = Tags.expand(Search.byID(systems, "techno" + tp.rank));
    ai.specialMount = "Custom AI";
    sys.push(ai);  
  }
  
  //collect all licenses required
  var isEverest = config.shell.id === "everest"
  var licenses = [{
    "source": config.shell.source,
    "name": isEverest ? "" : config.shell.name,
    "level": isEverest ? "" : 2,
    "items": `${config.shell.source} ${config.shell.name} Shell`
  }]

  var items = sys.concat(mounts.map(m => m.weapon).filter(x => x != null));

  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    if (item.source == "Special" || item.license === "" && item.source !== "GMS") continue;
    var lIndex = licenses.findIndex(l => l.name === item.license);
    if (lIndex > -1) {
      if (licenses[lIndex].level < item.license_level) { //if our new item exceeds our current license level
        var upperIdx = licenses.findIndex(l => l.level === item.license_level);
        if (upperIdx < 0) { //if we don't already have this license recorded, add it
          licenses.push({ 
            "source": item.source,
            "name": item.license,
            "level": item.license_level,
            "items": item.name
          })
        } else {
          licenses[upperIdx].items += ", " + item.name;  //otherwise, mark the system on the higher level license
        }
      }
      licenses[lIndex].items += ", " + item.name;
    } else {
      licenses.push({
        "source": item.source,
        "name": item.license,
        "level": item.license_level,
        "items": item.name
      })
    }
  }


  var aptitudes = {
    "melee": 0,
    "ranged": 0,
    "tech": 0,
    "support": 0,
    "control": 0,
    "repair": 0
  };

  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    for (key in item.aptitude) {
      aptitudes[key] += item.aptitude[key];
    }
  }

  for (var i = 0; i < licenses.length; i++) {
    var l = licenses[i];
    if (l.source === "GMS") {
      licenses[i].locked = false;
    } else {
      var lockIndex = pilot.licenses.findIndex(pl => pl.name === l.name);
      if (lockIndex == -1) licenses[i].locked = true;
      else if (pilot.licenses[lockIndex].level < l.level) licenses[i].locked = true;
      else licenses[i].locked = false;
    }
  }


  //move gms to the front of the license block
  var gmsIndex = licenses.findIndex(l => l.source === "GMS");
  if (gmsIndex > 0) move(licenses, gmsIndex, 0);

  //make sure the shell is the second item
  var shellIndex = licenses.findIndex(l => l.source === config.shell.source);
  if (shellIndex > 0) move(licenses, shellIndex, 1);

  var info_template = Handlebars.compile(infoTemplate);
  $("#mech-info-output").html(info_template({config: config, stats: stats, licenses: licenses}));

  var stat_template = Handlebars.compile(statsTemplate);
  $("#mech-stats-output").html(stat_template(stats));

  var sp = {
    max: stats.max_sp,
    free: stats.max_sp - items.filter(i => i.sp != null).reduce((a, b) => a + b.sp, 0)
  }

 
   var gear_template = Handlebars.compile(loadoutTemplate);
  $("#mech-gear-output").html(gear_template({
    "mounts": mounts,
    "systems": sys,
    "shell": config.shell,
    "sp": sp
  }));
  
  Charts(mounts.map(m => m.weapon).filter(x => x != null), aptitudes);

  //TODO: animations aren't playing well with div show/hide. Fix via canvas?
  //bad hack incoming:
  $("#damage-mount-chart, #damage-type-chart").css('display', 'none');

  $('.chart-selector').on('change', function() {
    var t = $(this).val();
    switch (t) {
      case "range":
        $("#damage-mount-chart, #damage-type-chart").css('display', 'none');
        $("#damage-range-chart").css('display', 'block')
        break;
      case "mount":
        $("#damage-range-chart, #damage-type-chart").css('display', 'none');
        $("#damage-mount-chart").css('display', 'block')
        break;
      case "type":
        $("#damage-range-chart, #damage-mount-chart").css('display', 'none');
        $("#damage-type-chart").css('display', 'block')
        break;
      default:
        break;
    }
  })

  var shell_info_template = Handlebars.compile(shellModalTemplate);
  $("#shell-info-modal-output").html(shell_info_template(config.shell));

  $("#shell-info-btn").click(function () {
    var modalID = $(this).data("modal");
    $('#' + modalID).css("display", "block");
  });

  $('.close').click(function () {
    var modalID = $(this).data("modal");
    $('#' + modalID).css("display", "none");
  });

  Expander.bindEquipment();

  //bind mount buttons
  $('.mount-btn').each(function(){
    var e = $(this);
    e.off();
    e.click(function() {
      openMountModal(mounts[parseInt(e.data('mount-idx'))], e.data('mount-idx'), pilot, config, mounts.map(m => m.weapon).filter(x => x != null), sp);
    })
  })

  //bind system buttons
  $('.system-btn').each(function () {
    var e = $(this);
    e.off();
    e.click(function () {
      openSystemModal(sys[parseInt(e.data('system-idx'))], e.data('system-idx'), pilot, config, sp, sys);
    })
  })
}

function move (arr, old_index, new_index) {
  if (new_index >= arr.length) {
    var k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
};

function openMountModal(m, m_idx, pilot, config, installed_weapons, sp) {
  //apply modal template
  var equip_template = Handlebars.compile(equipModalTemplate);
  $("#mountEditorModal").html(equip_template(m));

  $('#mountEditorModal').css("display", "block");
  
  if (m.weapon) $('#add-remove-mod-btn').addClass('btn').removeClass('disabled');

  $('.close').click(function () {
    var modalID = $(this).data("modal");
    $('#' + modalID).css("display", "none");
  });

  var validMounts = [m.mount];
  if (m.mount === "Flex") validMounts = ["Auxiliary", "Main"]
  if (m.mount === "Core") validMounts = ["Auxiliary", "Main", "Heavy"]
  if (m.mount === "Spinal") validMounts = ["Main", "Heavy"]
  if (m.mount === "Apocalypse") validMounts = ["Superheavy", "Heavy", "Main", "Auxiliary"]

  //TODO: if there's not another empty mount AND we're not apocalypse type, filter superheavy weapons and show a warning
  
  var availableWeapons = [];
  var installedUniques = installed_weapons.filter(w => w.isUnique);
  var totalFreeSp = m.weapon ? sp.free + m.weapon.sp : sp.free; //include replacement sp


  for (var i = 0; i < weapons.length; i++) {
    var w = weapons[i];
    if (w.source !== "GMS") {
      if (installedUniques.findIndex(x => x.id === w.id) > -1) continue;
      var licenseIdx = pilot.licenses.findIndex(l => l.name === w.license);
      if (licenseIdx === -1) continue;
      if (pilot.licenses[licenseIdx].level < w.license_level) continue;
    }
    if (totalFreeSp < w.sp) w.isOverSp = true;
    if (validMounts.includes(w.mount)) availableWeapons.push(Tags.expand(w))
  }

  //TODO: get all mods available for that mount
  //populate mod list

  var weapon_template = Handlebars.compile(equipWeaponItemTemplate);
  $("#available-weapons").append(weapon_template({
    weapons: availableWeapons,
    installed: m.weapon
  }));

  $('.caret-expander').click(function () {
    var e = $(this);
    e.toggleClass('caret-closed caret-open');
    $(e.parent().find(".caret-expand")).toggle("swing");
  });

  $('.weapon-item').click(function () {
    var e = $(this);
    if (e.data("isover") == true) return;
    $('#add-remove-mod-btn').addClass('btn').removeClass('disabled');
    $('#add-remove-mod-btn').click(function(){
        $('#modEditorModal').css("display", "block");
    })
    //TODO: check mod (in installed) compatibility and SP. Remove and notify if necessary
    $('.weapon-item').removeClass("skill-upgrade")
    e.addClass("skill-upgrade");
    $("#mount-install").off();
    if(e.data("remove")) {
      $("#mount-install").text("Unmount " + e.data("name")).removeClass("disabled").addClass("alert").click(function () {
        removeMountedWeapon(m_idx, pilot, config);
        $('#mountEditorModal').css("display", "none");
      })
    } else {
      $("#mount-install").text("Mount " + e.data("name")).removeClass("disabled alert").click(function () {
        addWeaponToMount(e.data("id"), m_idx, pilot, config);
        $('#mountEditorModal').css("display", "none");
      })
    }
  });

  var mod_template = Handlebars.compile(modModalTemplate);
  $('#modEditorModal').html(mod_template({}));

  
}

function addWeaponToMount(weapon_id, mount_idx, pilot, config){
  config.mounts[mount_idx].weapon_id = weapon_id;
  if (config.mounts[mount_idx].mods) delete config.mounts[idx].mods;
  loadMech(configurations[mechSidebar.updateConfig(config)], pilot)
}

function removeMountedWeapon(idx, pilot, config) { 
  if (idx == null) {
    console.error('Error: Bad system index');
    return;
  } else {   
    config.mounts[idx].weapon_id = "";
    if (config.mounts[idx].mods) delete config.mounts[idx].mods;
  }
  loadMech(configurations[mechSidebar.updateConfig(config)], pilot)
}

function openSystemModal(s, s_idx, pilot, config, sp, installed_systems) {
  //apply modal template
  var equip_template = Handlebars.compile(systemModalTemplate);
  $("#systemEditorModal").html(equip_template(s));

  $('#systemEditorModal').css("display", "block");

  $('.close').click(function () {
    var modalID = $(this).data("modal");
    $('#' + modalID).css("display", "none");
  });


  var availableSystems = [];
  var totalFreeSp = s ? sp.free + s.sp : sp.free; //include replacement sp
  var installedUniques = installed_systems.filter(s => s.isUnique);
  var installedais = installed_systems.filter(s => s.isAi);
  var ai_limit = pilot.core_bonuses.includes("cb_shaping") ? 2 : 1;
  
  for (var i = 0; i < systems.length; i++) {
    var sys = systems[i];
    if (installedUniques.find(x => x.id === sys.id)) continue;
    if (installedais.length >= ai_limit) continue;
    if (sys.source !== "GMS") {
      var licenseIdx = pilot.licenses.findIndex(l => l.name === sys.license);
      if (licenseIdx === -1) continue;
      if (pilot.licenses[licenseIdx].level < sys.license_level) continue;
    }
    if (totalFreeSp < sys.sp) sys.isOverSp = true;
    availableSystems.push(Tags.expand(sys))
  }


  var system_template = Handlebars.compile(systemItemTemplate);
  $("#available-systems").append(system_template({
    systems: availableSystems,
    installed: s
  }));

  $('.caret-expander').click(function () {
    var e = $(this);
    e.toggleClass('caret-closed caret-open');
    $(e.parent().find(".caret-expand")).toggle("swing");
  });

  $('.system-item').click(function () {
    var e = $(this);   
    if (e.data("isover") == true) return;
    $('.system-item').removeClass("skill-upgrade")       
    e.addClass("skill-upgrade");
    $("#system-install").off();
    if(e.data("remove")) {
      $("#system-install").text("Uninstall " + e.data("name")).removeClass("disabled").addClass("alert").click(function () {
        removeSystem(s_idx, pilot, config);
        $('#systemEditorModal').css("display", "none");
      })
    } else {
      $("#system-install").text("Install " + e.data("name")).removeClass("disabled alert").click(function () {
        addSystem(e.data("id"), s_idx, pilot, config);
        $('#systemEditorModal').css("display", "none");
      })
    }
  });

}

function addSystem(system_id, idx, pilot, config) {
  if (idx != null) {
    config.systems[idx].id = system_id;
  } else {
    config.systems.push({id: system_id})
  }
  loadMech(configurations[mechSidebar.updateConfig(config)], pilot)
}

function removeSystem(idx, pilot, config) {
  if (idx == null) {
    console.error('Error: Bad system index');
    return;
  } else {
    config.systems.splice(idx, 1);
  }
  loadMech(configurations[mechSidebar.updateConfig(config)], pilot)
}

module.exports = loadMech;