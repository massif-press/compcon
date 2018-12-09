const $ = require('jquery');
const Handlebars = require('handlebars');
const io = require('./util/io');
const Tags = require('./util/taghelper');
const Expander = require('./util/expander');
const mechSidebar = require("./mech-sidebar");
const Search = require('./util/search');
//data
const weapons = require("../extraResources/data/weapons.json");
const mods = require("../extraResources/data/mods.json");
const systems = require("../extraResources/data/systems.json");
//templates
const equipModalTemplate = io.readTemplate('editors/mount-editor');
const systemModalTemplate = io.readTemplate('editors/system-editor');
const equipWeaponItemTemplate = Handlebars.compile(io.readTemplate('editors/mech-weapon'));
const systemItemTemplate = io.readTemplate('editors/mech-system');
const modModalTemplate = io.readTemplate('editors/mod-editor');

var activeIndex;
var modSelection;
var ammoSelection;
var currentFreeSp;

function openMountModal(mech, idx) {
  activeIndex = idx;
  console.log(idx);
  modSelection = "";
  ammoSelection = "";
  currentFreeSp = 0;
  
  $("#new-mod-info").html("");
  $("#mount-cancel-btn").text("Cancel")

  var m = mech.mounts.find(m => m.mount_index == idx);
  console.log(idx, m);
  var installedAmmo = getInstalledAmmo(m);
  var installedMod = getInstalledMod(m);
  
  setModDisplayBlock(m);

  var equip_template = Handlebars.compile(equipModalTemplate);
  $("#mountEditorModal").html(equip_template(m));

  $('#mountEditorModal').css("display", "block");

  $('#add-remove-mod-btn').off()
  if (m.weapon) $('#add-remove-mod-btn').addClass('btn').removeClass('disabled').click(function () {
    openModModal(m, mech, m.weapon.id);
  });

  $('#add-remove-ammo-btn').off()
  if (m.weapon && m.weapon.type !== "Melee") $('#add-remove-ammo-btn').addClass('btn').removeClass('disabled').click(function () {
    openAmmoModal(getAmmoList(mech.pilot_licenses, m.weapon, installedMod), installedAmmo);
  });

  setAvailableWeaponList(m, mech, installedMod ? installedMod.sp : 0);

  Expander.bindModalClose()
}

function setAvailableWeaponList(m, mech, extraSpCost) {
  var validMounts = [m.mount];
  if (m.mount === "Flex") validMounts = ["Auxiliary", "Main"]
  if (m.isCoreMount) validMounts = ["Auxiliary", "Main", "Heavy"] //TODO: set cb_retrofit, mount gains new isCoreMount prop
  if (m.mount === "Spinal") validMounts = ["Main", "Heavy", "Superheavy"]
  if (m.mount === "Apocalypse") validMounts = ["Superheavy", "Heavy", "Main", "Auxiliary"]

  //TODO: if there's not another empty mount AND we're not apocalypse type, filter superheavy weapons and show a warning

  var activeMod;
  var validTypes = [];
  if (modSelection) {
    activeMod = Search.byID(mods, modSelection);
  } else if (m.weapon.mods) {
    var first = m.weapon.mods.find(x => x.modType !== "Core Bonus" && x.modType !== "Talent");
    if (first) activeMod = first;
  }
  if (activeMod) {
    if (!activeMod.applied_to.includes("weapon") && activeMod.applied_to.includes("ranged")) 
      validTypes = ["cqb", "cannon", "rifle", "launcher"]
    else validTypes = validTypes.concat(activeMod.applied_to);
  }

  var availableWeapons = [];
  var installed_weapons = mech.mounts.map(m => m.weapon).filter(x => x != null);
  var installedUniques = installed_weapons.filter(w => w.isUnique);
  currentFreeSp = m.weapon ? mech.sp.free + m.weapon.sp : mech.sp.free; //include replacement sp

  for (var i = 0; i < weapons.length; i++) {
    var w = weapons[i];
    if (w.source !== "GMS") {
      if (installedUniques.findIndex(x => x.id === w.id) > -1) continue;
      var licenseIdx = mech.pilot_licenses.findIndex(l => l.name === w.license);
      if (licenseIdx === -1) continue;
      if (mech.pilot_licenses[licenseIdx].level < w.license_level) continue;
    }
    w.preSelect = w.id === m.weapon.id;
    w.disp_sp = w.sp + extraSpCost;
    w.isOverSp = currentFreeSp < w.disp_sp;
    w.isIncompatibleMod = validTypes.length && !validTypes.includes(w.type.toLowerCase());
    w.isLocked = w.isOverSp || w.isIncompatibleMod; //for handlebars
    if (validMounts.includes(w.mount)) availableWeapons.push(Tags.expand(w))
  }

  $("#available-weapons").html(equipWeaponItemTemplate({
    weapons: availableWeapons,
    installed: m.weapon
  }));

  $('.weapon-item').click(function () {
    var e = $(this);
    if (e.data("isover") === true) {
      if (e.hasClass("skill-upgrade")) {
        e.removeClass("skill-upgrade")
        $("#mount-install").off().addClass("disabled").removeClass("btn").text("/ / NO SELECTION / /");
      }
      return;
    }
    $('#add-remove-mod-btn').off()
    $('#add-remove-mod-btn').addClass('btn').removeClass('disabled').click(function () {
      openModModal(m, mech, e.data("id"));
    })
    $('.weapon-item').removeClass("skill-upgrade")
    e.addClass("skill-upgrade");
    $("#mount-install").off();
    bindInstallMount(e, mech, m);
  });

  Expander.bindCarets();
}

function bindInstallMount(element, mech, mount) {
  var isRemoval = element.data("remove");
  var newWeaponID = element.data("id")
  var verb = isRemoval ? "Unmount" : "Mount";
  $("#mount-install").text(`${verb} ${element.data("name")}`).removeClass("disabled alert").click(function () {
    //if removal:
    //if mount type is flex or core, and mounted weapon is not aux, remove linked mount (and show warning)
    // mounting a ${w.mount} weapon to this mount with remove the ${otherweapon} mounted in the linked auxiliary mount
    // removing this weapon will unmount the ${otherweapon} in the linked auxiliary mount

    //if mount type is flex or core, and mounted weapon IS aux, add linked aux mount and show message
    // mounting an auxiliary weapon to a ${m.mount} mount grants an additional auxiliary mount

    //if mount type is superheavy, show link warning
    // mounting a superheavy weapon will occupy an additional mount

    //TODO:
    // open mount lock submodal for superheavies
    // select locked mount
    // call changemount

    var updatedMount = {
      mount: mount.mount,
      weapon_id: newWeaponID,
      mount_index: mount.mount_index
    }
    if (modSelection && !isRemoval) updatedMount.mods = [modSelection];
    changeMount(mech.config.id, updatedMount, mech.pilot_id);
    $('#mountEditorModal').css("display", "none");
  })
}

function getModList(licenses, weapon_id, installedMod) {
  var weapon = Search.byID(weapons, weapon_id);
  if (!weapon) return;
  var totalEquippedSp = installedMod ? installedMod.sp : 0;
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
        m.modType === "Modification" &&
        licenses.some(l => l.name === m.license && l.level <= m.license_level)
      )
    }
  );
  for (var i = 0; i < availableMods.length; i++) {
    availableMods[i].isOverSp = availableMods[i].sp > (currentFreeSp + totalEquippedSp);
    if (installedMod) availableMods[i].preSelect = availableMods[i].id === installedMod.id;
  }
  return availableMods;
}

function getAmmoList(licenses, weapon, installedAmmo) {
  if (!weapon) return;
  var totalEquippedSp = installedAmmo.length ? installedAmmo.map(a => a.sp).reduce((a,b) => a + b, 0) : 0;
  var availableAmmo = mods.filter(m => {
      return (
        m.modType === "Ammo" &&
        licenses.some(l => l.name === m.license && l.level <= m.license_level)
      )});

  for (var i = 0; i < availableAmmo.length; i++) {
    availableMods[i].isOverSp = availableAmmo[i].sp > (currentFreeSp + totalEquippedSp);
  }

  return availableAmmo;
}

function openModModal(mount, mech, weapon_id) {
  var availableMods = getModList(mech.pilot_licenses, weapon_id, installedMod);
  var installedMod = getInstalledMod(mount);
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
      $("#mount-install").off().removeClass("disabled").addClass("btn").text("Update Mounted Weapon")
      $("#mod-install").text("Remove " + e.data("name")).removeClass("disabled alert").click(function () {
        $("#mount-install").removeClass("disabled").addClass("btn").text("Update Mounted Weapon")
        modSelection = "";
        $("#all-mods").html("")
        setAvailableWeaponList(mount, mech, 0);
        $('#modEditorModal').css("display", "none");
      });
    } else {
      $("#mod-install").text("Install " + e.data("name")).removeClass("disabled alert").click(function () {
        $("#mount-install").removeClass("disabled").addClass("btn").text("Update Mounted Weapon")
        modSelection = e.data("id");
        $("#all-mods").html(`<br><i class="icon-plus-squared"></i><span>${e.data("name")}</span><span class="subtitle">&nbsp;INSTALLED</span>`);
        setAvailableWeaponList(mount, mech, parseInt(e.data("sp")));
        bindInstallMount($(".weapon-item"))
        $('#modEditorModal').css("display", "none");
      })
    }
  });

  Expander.bindModalClose()
  Expander.bindCarets();
}

function openAmmoModal(availableAmmo, equippedAmmo) {
  var mod_template = Handlebars.compile(modModalTemplate);
  $('#modEditorModal').html(mod_template({
    mods: availableAmmo,
    installed: equippedAmmo,
    none: availableAmmo.length == 0
  }));

  $('#modEditorModal').css("display", "block");

  $('.mod-item').click(function () {
    var e = $(this);
    if (e.data("isover") === true) return;
    $('.mod-item').removeClass("skill-upgrade")
    e.addClass("skill-upgrade");
    $("#mod-install").off();
    if (e.data("remove")) {
      $("#mount-install").removeClass("disabled").addClass("btn").text("Update Mounted Weapon")
      $("#mod-install").text("Remove " + e.data("name")).removeClass("disabled alert").click(function () {
        modSelection = ""
        $("#all-mods").html("");
        $('#modEditorModal').css("display", "none");
      })
    } else {
      $("#mod-install").text("Install " + e.data("name")).removeClass("disabled alert").click(function () {
        $("#mount-install").removeClass("disabled").addClass("btn").text("Update Mounted Weapon")
        modSelection = e.data("id");
        $("#all-mods").html(`<br><i class="icon-plus-squared"></i><span>${e.data("name")}</span><span class="subtitle">&nbsp;MOD INSTALLED</span>`)
        $('#modEditorModal').css("display", "none");
      })
    }
  });

  Expander.bindModalClose()
  Expander.bindCarets();
}

function changeMount(config_id, updatedMount, pilot_id) {
  mechSidebar.updateMount(config_id, updatedMount, activeIndex, pilot_id);
}

function openSystemModal(mech, idx, hasCbShaping) {
  activeIndex = idx;
  var s = mech.systems[idx]

  var equip_template = Handlebars.compile(systemModalTemplate);
  $("#systemEditorModal").html(equip_template(s));

  $('#systemEditorModal').css("display", "block");

  Expander.bindModalClose()

  var availableSystems = [];
  var installed_systems = mech.systems.filter(x => x != null);
  currentFreeSp = s ? mech.sp.free + s.sp : mech.sp.free; //include replacement sp
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
    s.preSelect = sys.id === s.id;
    sys.isOverSp = currentFreeSp < sys.sp;
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
    if (e.data("remove")) {
      $("#system-install").text("Uninstall " + e.data("name")).removeClass("disabled").addClass("alert").click(function () {
        changeSystem(null, mech.pilot_id, mech.config.id);
        $('#systemEditorModal').css("display", "none");
      })
    } else {
      $("#system-install").text("Install " + e.data("name")).removeClass("disabled alert").click(function () {
        changeSystem(e.data("id"), idx, mech.pilot_id, mech.config.id);
        $('#systemEditorModal').css("display", "none");
      })
    }
  });
}

function changeSystem(system_id, pilot_id, config_id) {
  mechSidebar.updateSystem(config_id, system_id ? { id: system_id } : null, activeIndex, pilot_id);
}

function setModDisplayBlock(mount) {
  var installedMod = getInstalledMod(mount);
  var installedAmmo = getInstalledAmmo(mount)
  var str = "";
  if (installedMod) str += `<span><i class="icon-plus-squared"></i><span id="equipped-mod">${installedMod.name}</span><span class="subtitle">&nbsp INSTALLED</span></span>&emsp;`
  if (installedAmmo) {
    for (var i = 0; i < installedAmmo.length; i++) {
      str += `<span><i class="icon-plus-squared"></i><span>${installedAmmo[i].name}</span></span>&nbsp;`
    }
  }
  $('#all-mods').html(str);
}

function getInstalledMod(mount) {
  if (modSelection) return Search.byID(mods, modSelection);
  return mount.mods ? mount.mods.find(x => x.modType === "Modification") || null : null;
}

function getInstalledAmmo(mount) {
  return mount.mods ? mount.mods.filter(x => x.modType === "Ammo") || null : null;
}

module.exports.openMountModal = openMountModal;
module.exports.openSystemModal = openSystemModal;