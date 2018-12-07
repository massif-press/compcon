const $ = require('jquery');
const Handlebars = require('handlebars');
const io = require('./util/io');
const Tags = require('./util/taghelper');
// const Charts = require('./util/chartbuilder');
const Expander = require('./util/expander');
const mechSidebar = require("./mech-sidebar");
const MechBuilder = require("./util/mechbuilder");
// const Search = require("./util/search");
//data
const weapons = require("../extraResources/data/weapons.json");
const mods = require("../extraResources/data/mods.json");
const systems = require("../extraResources/data/systems.json");
// const configurations = require("../extraResources/data/configurations.json");
// const pilots = require("../extraResources/data/pilots.json");
//templates
const loadoutTemplate = io.readTemplate('mech-loadout');
const infoTemplate = io.readTemplate('mech-info');
const statsTemplate = io.readTemplate('mech-stats');
const shellModalTemplate = io.readTemplate('mech-shell-modal');
const equipModalTemplate = io.readTemplate('editors/mount-editor');
const systemModalTemplate = io.readTemplate('editors/system-editor');
const equipWeaponItemTemplate = Handlebars.compile(io.readTemplate('editors/mech-weapon'));
const systemItemTemplate = io.readTemplate('editors/mech-system');
const modModalTemplate = io.readTemplate('editors/mod-editor');

var modSelection;

function loadMech(config, pilot) {
  $(".main-scroll").scrollTop(1);
  
  var mech = MechBuilder(config, pilot);

  var info_template = Handlebars.compile(infoTemplate);
  $("#mech-info-output").html(info_template(mech));

  var stat_template = Handlebars.compile(statsTemplate);
  $("#mech-stats-output").html(stat_template(mech.stats));

  var gear_template = Handlebars.compile(loadoutTemplate);
  $("#mech-gear-output").html(gear_template(mech));
  
  var shell_info_template = Handlebars.compile(shellModalTemplate);
  $("#shell-info-modal-output").html(shell_info_template(mech.shell));

  $("#shell-info-btn").click(function () {
    var modalID = $(this).data("modal");
    $('#' + modalID).css("display", "block");
  });

  //bind mount buttons
  $('.mount-btn').each(function(){
    var e = $(this);
    e.off();
    e.click(function () { openMountModal(mech, e.data('mount-idx')) });
  })

  //bind system buttons
  $('.system-btn').each(function () {
    var e = $(this);
    e.off();
    e.click(function () { openSystemModal(mech, e.data('system-idx'), pilot.core_bonuses.includes("cb_shaping")); })
  })

  Expander.bindModalClose()
  Expander.bindEquipment();
  // drawCharts();
}

// function drawCharts(){
//   Charts(mounts.map(m => m.weapon).filter(x => x != null), items);

//   $("#damage-mount-chart, #damage-type-chart").css('display', 'none');

//   $('.chart-selector').on('change', function () {
//     var t = $(this).val();
//     switch (t) {
//       case "range":
//         $("#damage-mount-chart, #damage-type-chart").css('display', 'none');
//         $("#damage-range-chart").css('display', 'block')
//         break;
//       case "mount":
//         $("#damage-range-chart, #damage-type-chart").css('display', 'none');
//         $("#damage-mount-chart").css('display', 'block')
//         break;
//       case "type":
//         $("#damage-range-chart, #damage-mount-chart").css('display', 'none');
//         $("#damage-type-chart").css('display', 'block')
//         break;
//       default:
//         break;
//     }
//   });
// }

function openMountModal(mech, idx) {
  modSelection = "";
  $("#new-mod-info").html("");

  var m = mech.mounts.find(m => m.mount_index == idx);
  var installedMod = m.mods ? m.mods.find(x => x.modType !== "Core Bonus" && x.modType !== "Talent") || null : null;

  var equip_template = Handlebars.compile(equipModalTemplate);
  $("#mountEditorModal").html(equip_template(m));

  $('#mountEditorModal').css("display", "block");
  
  $('#add-remove-mod-btn').off()
  if (m.weapon) $('#add-remove-mod-btn').addClass('btn').removeClass('disabled').click(function () {
    openModModal(getModList(mech.pilot_licenses, m.weapon, installedMod, mech.sp), installedMod);
  });

  var validMounts = [m.mount];
  if (m.mount === "Flex") validMounts = ["Auxiliary", "Main"]
  if (m.isCoreMount) validMounts = ["Auxiliary", "Main", "Heavy"] //TODO: set cb_retrofit, mount gains new isCoreMount prop
  if (m.mount === "Spinal") validMounts = ["Main", "Heavy", "Superheavy"]
  if (m.mount === "Apocalypse") validMounts = ["Superheavy", "Heavy", "Main", "Auxiliary"]

  //TODO: if there's not another empty mount AND we're not apocalypse type, filter superheavy weapons and show a warning
  var availableWeapons = [];
  var installed_weapons = mech.mounts.map(m => m.weapon).filter(x => x != null);
  var installedUniques = installed_weapons.filter(w => w.isUnique);
  var totalFreeSp = m.weapon ? mech.sp.free + m.weapon.sp : mech.sp.free; //include replacement sp

  for (var i = 0; i < weapons.length; i++) {
    var w = weapons[i];
    if (w.source !== "GMS") {
      if (installedUniques.findIndex(x => x.id === w.id) > -1) continue;
      var licenseIdx = mech.pilot_licenses.findIndex(l => l.name === w.license);
      if (licenseIdx === -1) continue;
      if (mech.pilot_licenses[licenseIdx].level < w.license_level) continue;
    }
    if (totalFreeSp < w.sp) w.isOverSp = true;
    if (validMounts.includes(w.mount)) availableWeapons.push(Tags.expand(w))
  }

  $("#available-weapons").html(equipWeaponItemTemplate({
    weapons: availableWeapons,
    installed: m.weapon
  }));

  getModList(mech.pilot_licenses, m.weapon, mech.sp)

  $('.weapon-item').click(function () {
    var e = $(this);
    if (e.data("isover") === true) return;
    $('#add-remove-mod-btn').off()
    $('#add-remove-mod-btn').addClass('btn').removeClass('disabled').click(function(){
      var installedMod = w.mods.find(x => x.modType !== "Core Bonus" && x.modType !== "Talent") || null;
      openModModal(getModList(mech.pilot_licenses, m.weapon, installedMod, mech.sp), installedMod);
    })
    $('.weapon-item').removeClass("skill-upgrade")
    e.addClass("skill-upgrade");
    $("#mount-install").off();
    if(e.data("remove")) {
      //if mount type is flex or core, and mounted weapon is not aux, remove linked mount (and show warning)
        // mounting a ${w.mount} weapon to this mount with remove the ${otherweapon} mounted in the linked auxiliary mount
        // removing this weapon will unmount the ${otherweapon} in the linked auxiliary mount
      $("#mount-install").text("Unmount " + e.data("name")).removeClass("disabled").addClass("alert").click(function () {
        changeMount("", idx, mech.pilot_id, mech.config.id);
        $('#mountEditorModal').css("display", "none");
      })
    } else {
      $("#mount-install").text("Mount " + e.data("name")).removeClass("disabled alert").click(function () {
        //if mount type is flex or core, and mounted weapon IS aux, add linked aux mount and show message
          // mounting an auxiliary weapon to a ${m.mount} mount grants an additional auxiliary mount

        //if mount type is superheavy, show link warning
          // mounting a superheavy weapon will occupy an additional mount

        //TODO:
          // open mount lock submodal for superheavies
          // select locked mount
          // call changemount

        var updatedMount = {
          mount: m.mount,
          weapon_id: e.data("id"),
          mount_index: m.mount_index
        }
        if (modSelection) updatedMount.mods = [modSelection];
        else updatedMount.mods = [];
        changeMount(updatedMount, idx, mech.pilot_id, mech.config.id);
        $('#mountEditorModal').css("display", "none");
      })
    }
  });

  Expander.bindModalClose()
  Expander.bindCarets();
}

function getModList(licenses, weapon, installedMod, sp) {
  var totalEquippedModSp = installedMod ? installedMod.sp : 0;
  var availableMods = mods.filter(
    m => {
      return (
        m.applied_to.includes("weapon") ||
        m.applied_to.includes("ranged") && weapon.type !== "Melee" ||
        m.applied_to.includes("melee") && weapon.type === "Melee" ||
        m.applied_to.includes(weapon.type.toLowerCase()) ||
        m.applied_to.includes("limited") && weapon.tags.find(t => t.id = "limited")
      )
    }
  ).filter(
    m => {
      return (
        m.modType !== "Core Bonus" &&
        m.modType !== "Talent" &&
        licenses.some(l => l.name === m.license && l.level <= m.license_level)
      )
    }
  );
  for (var i = 0; i < availableMods.length; i++) {
    if (availableMods[i].sp > sp.free + totalEquippedModSp) availableMods[i].isOverSp = true;
  }
  return availableMods;
}

function openModModal(availableMods, installedMod) {
  var mod_template = Handlebars.compile(modModalTemplate);
  $('#modEditorModal').html(mod_template({
    mods: availableMods,
    installed: installedMod,
    none: availableMods.length == 0 
  }));

  $('#modEditorModal').css("display", "block");

  $('.mod-item').click(function () {
    var e = $(this);
    if (e.data("isover") === true) return;
    $('.mod-item').removeClass("skill-upgrade")
    e.addClass("skill-upgrade");
    $("#mod-install").off();
    if (e.data("remove")) {
      $("#mod-install").text("Add " + e.data("name")).removeClass("disabled alert").click(function () {
        modSelection = ""
        $("#new-mod-info").html("");
        $('#modEditorModal').css("display", "none");
      })
    } else {
      $("#mod-install").text("Remove " + e.data("name")).removeClass("disabled alert").click(function () {
        modSelection = e.data("id");
        $("#new-mod-info").html(`<br><i class="icon-plus-squared"></i><span>${e.data("name")}</span><span class="subtitle">&nbsp;MOD INSTALLED</span>`)
        $('#modEditorModal').css("display", "none");
      })
    }
  });

  Expander.bindModalClose()
  Expander.bindCarets();
}

function changeMount(updatedMount, mount_idx, pilot_id, config_id) {
  mechSidebar.updateMount(config_id, updatedMount, mount_idx, pilot_id);
}

function openSystemModal(mech, idx, hasCbShaping) {
  var s = mech.systems[idx]

  var equip_template = Handlebars.compile(systemModalTemplate);
  $("#systemEditorModal").html(equip_template(s));

  $('#systemEditorModal').css("display", "block");

  Expander.bindModalClose()

  var availableSystems = [];
  var installed_systems = mech.systems.filter(x => x != null);
  var totalFreeSp = s ? mech.sp.free + s.sp : mech.sp.free; //include replacement sp
  var installedUniques = installed_systems.filter(s => s.isUnique);
  var installedais = installed_systems.filter(s => s.isAi);
  var ai_limit = hasCbShaping ? 2 : 1;
  
  for (var i = 0; i < systems.length; i++) {
    var sys = systems[i];
    if (installedUniques.find(x => x.id === sys.id)) continue;
    if (installedais.length >= ai_limit) continue;
    if (sys.source === "Special") continue;
    if (sys.source !== "GMS") {
      var licenseIdx = mech.licenses.findIndex(l => l.name === sys.license);
      if (licenseIdx === -1) continue;
      if (mech.licenses[licenseIdx].level < sys.license_level) continue;
    }
    if (totalFreeSp < sys.sp) sys.isOverSp = true;
    availableSystems.push(Tags.expand(sys))
  }

  var system_template = Handlebars.compile(systemItemTemplate);
  $("#available-systems").append(system_template({
    systems: availableSystems,
    installed: s
  }));

  Expander.bindCarets();

  $('.system-item').click(function () {
    var e = $(this);   
    if (e.data("isover") == true) return;
    $('.system-item').removeClass("skill-upgrade")       
    e.addClass("skill-upgrade");
    $("#system-install").off();
    if(e.data("remove")) {
      $("#system-install").text("Uninstall " + e.data("name")).removeClass("disabled").addClass("alert").click(function () {
        changeSystem(s_idx, mech.pilot_id, mech.config.id);
        $('#systemEditorModal').css("display", "none");
      })
    } else {
      $("#system-install").text("Install " + e.data("name")).removeClass("disabled alert").click(function () {
        changeSystem(e.data("id"), s_idx, mech.pilot_id, mech.config.id);
        $('#systemEditorModal').css("display", "none");
      })
    }
  });
}

function changeSystem(system_id, system_idx, pilot_id, config_id) {
  mechSidebar.updateSystem(config_id, system_id ? { id: system_id } : null, system_idx, pilot_id);
}

module.exports = loadMech;