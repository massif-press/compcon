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
const linkSelectorTemplate = io.readTemplate('editors/sh-link-selector');

var activeIndex;
var modSelection;
var ammoSelection;
var currentFreeSp;

function openMountModal(mech, idx) {
  activeIndex = idx;
  modSelection = "";
  ammoSelection = "";
  currentFreeSp = 0;
  
  $("#new-mod-info").html("");
  $("#mount-extra-text").text("")
  $("#mount-cancel-btn").text("Cancel")

  var m = mech.mounts.find(m => m.mount_index == idx);

  var installedAmmo = getInstalledAmmo(m);
  var installedMod = getInstalledMod(m);
  
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
  setModDisplayBlock(m);

  Expander.bindModalClose()
}

function setAvailableWeaponList(m, mech, extraSpCost, preselectedWeapon) {
  var validMounts = [m.mount];
  if (m.mount === "Flex") validMounts = ["Auxiliary", "Main"]
  if (m.isCoreMount) validMounts = ["Auxiliary", "Main", "Heavy"] //TODO: set cb_retrofit, mount gains new isCoreMount prop
  if (m.mount === "Spinal" || m.mount === "Heavy") {
    if (mech.mounts.filter(x => !x.weapon).length > 1 || m.weapon.mount === "Superheavy") { //there are empty mounts, so we can equip a superheavy weapon (with a link)
      validMounts = ["Heavy", "Superheavy"]
    } else {
      validMounts = ["Heavy"]
      $("#mount-extra-text").text(`No free support mounts available, Superheavy weapons cannot currently be mounted to this configuration.`)
    }
    if (m.mount === "Spinal") validMounts.push("Main")
  }
  if (m.mount === "Apocalypse") validMounts = ["Superheavy", "Heavy", "Main", "Auxiliary"]

  var activeMod;
  var validTypes = [];
  if (modSelection) {
    activeMod = Search.byID(mods, modSelection);
  } else if (m.weapon && m.weapon.mods) {
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
  currentFreeSp += m.modSP || 0;

  for (var i = 0; i < weapons.length; i++) {
    var w = weapons[i];
    if (w.source !== "GMS") {
      if (installedUniques.findIndex(x => x.id === w.id) > -1) continue;
      var licenseIdx = mech.pilot_licenses.findIndex(l => l.name === w.license);
      if (licenseIdx === -1) continue;
      if (mech.pilot_licenses[licenseIdx].level < w.license_level) continue;
    }
    w.preSelect = m.weapon ? w.id === m.weapon.id : preselectedWeapon ? w.id === preselectedWeapon : false;
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
    if (e.hasClass("skill-upgrade")) return;
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
  var newWeaponID = element.data("id");
  var newWeaponObj = weapons.find(w => w.id === newWeaponID);
  var verb = isRemoval ? "Unmount" : "Mount";
  var otherMount = mech.mounts.find(x => x.linked_index === mount.mount_index);
  var auxLink = "";
  var shLink;

  if (mount.mount === "Flex" || mount.isCoreMount) {
    if (newWeaponObj && newWeaponObj.mount === "Auxiliary" && (!mount.weapon || (mount.weapon && mount.weapon.mount !== "Auxiliary"))) {
      auxLink = "add";
      $("#mount-extra-text").text(`A ${mount.mount} mount can fit two Auxiliary weapons. A linked Auxiliary mount will be added to the configuration.`)
    }
    if ((isRemoval && otherMount) || (newWeaponObj && newWeaponObj.mount !== "Auxiliary" && otherMount)) {
      auxLink = "remove"
      var str_add = otherMount && otherMount.weapon ? `, including the mounted ${otherMount.weapon.name}` : "."
      if (isRemoval)
        $("#mount-extra-text").text(`Removing this weapon will remove the linked Auxiliary mount${str_add}`)
      else
        $("#mount-extra-text").text(`Mounting a ${newWeaponObj.mount} weapon to this mount with remove the linked Auxiliary mount${str_add}`)
    }
  }


  if (!isRemoval && newWeaponObj.mount === "Superheavy" && mount.mount !== "Apocalypse") {
    $("#mount-extra-text").text(`Mounting a Superheavy weapon will occupy an additional mount`)
    shLink = true;
  }

  mount.weapon && newWeaponID === mount.weapon.id 
    ? $("#mount-install").text(`Update Mount`)
    : $("#mount-install").text(`${verb} ${element.data("name")}`)
  $("#mount-install").removeClass("disabled alert").click(function () {

    if (auxLink === "add") {
      var linkedMount =  {
        mount: "Auxiliary",
        weapon_id: "",
        mount_index: mech.mounts.length + 1,
        linked_index: mount.mount_index
      }
      addMount(mech.config.id, linkedMount);
    } else if (auxLink === "remove") {
      removeMount(mech.config.id, otherMount.mount_index);
    }

    var updatedMount = {
      mount: mount.mount,
      weapon_id: newWeaponID,
      mount_index: mount.mount_index
    }
    if (mount.linked_index) updatedMount.linked_index = mount.linked_index;
    if (modSelection && !isRemoval) updatedMount.mods = [modSelection];

    if(isRemoval || newWeaponObj.mount !== "Superheavy") {
      if (mech.mounts.some(x => x.sh_lock && x.linked_index == mount.mount_index)) {
        mechSidebar.unlockMount(mech.config.id, mech.mounts.find(x => x.sh_lock && x.linked_index == mount.mount_index).mount_index);
      }
    }

    if (shLink) {
      if (!$('#sh-link-modal').length) {
        $('.main').append(`<div id="lockMountModal" class="modal sm"></div>`)
      } 
      var shLinkTemplate = Handlebars.compile(linkSelectorTemplate);
      var linkableMounts = mech.mounts.filter(x => !x.weapon && x.mount_index !== mount.mount_index && x.linked_index == null)
      $("#lockMountModal").html(shLinkTemplate({
        mounts: linkableMounts
      }));
      $('#lockMountModal').css("display", "block");
      Expander.bindModalClose();
      $('.mount-select-box').click(function() {
        var e = $(this);
        //find and remove any bonus aux mounts from flex or core mounts
        var selectedMount = mech.mounts.find(x => x.mount_index === e.data("mount-index"));
        if (selectedMount.isCoreMount || selectedMount.mount === "Flex") {
          var auxLinkedMount = mech.mounts.find(x => x.linked_index === selectedMount.mount_index);
          if (auxLinkedMount) removeMount(mech.config.id, auxLinkedMount.mount_index, mech.pilot_id);
        }

        mechSidebar.lockMount(mech.config.id, selectedMount.mount_index, mount.mount_index)
        changeMount(mech.config.id, updatedMount, mech.pilot_id);
        $('#lockMountModal').css("display", "none");
        $('#mountEditorModal').css("display", "none");
      });
    } else {
      changeMount(mech.config.id, updatedMount, mech.pilot_id);
      $('#mountEditorModal').css("display", "none");
    }
  });
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
        (m.modType === "Modification" || m.modType === "Ammo") &&
        licenses.some(l => l.name === m.license && l.level <= m.license_level)
      )
    }
  );
  for (var i = 0; i < availableMods.length; i++) {
    availableMods[i].isOverSp = availableMods[i].sp > (currentFreeSp + totalEquippedSp);
    availableMods[i].preSelect = installedMod ? availableMods[i].id === installedMod.id : false;
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
  var installedMod = getInstalledMod(mount);
  var availableMods = getModList(mech.pilot_licenses, weapon_id, installedMod);
  var mod_template = Handlebars.compile(modModalTemplate);
  $('#modEditorModal').html(mod_template({
    mods: availableMods,
    installed: installedMod,
    none: availableMods.length == 0
  }));

  $('#modEditorModal').css("display", "block");

  $('.mod-item').click(function () {
    var e = $(this);
    if (e.data("isover") === true || e.data("preselect") === true) return;
    $('.mod-item').removeClass("skill-upgrade")
    e.addClass("skill-upgrade");
    $("#mod-install").off();
    if (e.data("remove")) {
      $("#mod-install").text("Remove " + e.data("name")).removeClass("disabled alert").click(function () {
        $("#mount-install").removeClass("disabled").addClass("btn").text("Update Mount")
        modSelection = "";
        $("#all-mods").html("")
        setAvailableWeaponList(mount, mech, 0, weapon_id);
        bindInstallMount($("td.weapon-item.skill-upgrade"), mech, mount);
        $('#modEditorModal').css("display", "none");
      });
    } else {
      $("#mod-install").text("Install " + e.data("name")).removeClass("disabled alert").click(function () {
        modSelection = e.data("id");
        $("#all-mods").html(`<i class="icon-plus-squared"></i><span>${e.data("name")}</span><span class="subtitle">&nbsp;INSTALLED</span>`);
        setAvailableWeaponList(mount, mech, parseInt(e.data("sp")), weapon_id);       
        bindInstallMount($("td.weapon-item.skill-upgrade"), mech, mount);
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
        $("#all-mods").html(`<i class="icon-plus-squared"></i><span>${e.data("name")}</span><span class="subtitle">&nbsp;MOD INSTALLED</span>`)
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

function addMount(config_id, newMount, pilot_id) {
  mechSidebar.addMount(config_id, newMount, activeIndex, pilot_id);
}

function removeMount(config_id, mount_index, pilot_id) {
  mechSidebar.removeMount(config_id, mount_index, activeIndex, pilot_id);
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
    if (s) sys.preSelect = sys.id === s.id;
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
        changeSystem(e.data("id"), mech.pilot_id, mech.config.id);
        $('#systemEditorModal').css("display", "none");
      })
    }
  });
}

function changeSystem(system_id, pilot_id, config_id) {
  console.log(config_id);
  mechSidebar.updateSystem(config_id, system_id ? { id: system_id } : null, activeIndex, pilot_id);
}

function setModDisplayBlock(mount) {
  var installedMod = getInstalledMod(mount);
  var installedAmmo = getInstalledAmmo(mount);
 
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
  if (!mount.mods && !modSelection) return null;
  if (modSelection) return Search.byID(mods, modSelection);
  else return mount.mods.find(x => x.modType === "Modification" || x.modType === "Ammo") || null;
}

function getInstalledAmmo(mount) {
  return mount.mods ? mount.mods.filter(x => x.modType === "Ammo") || null : null;
}

module.exports.openMountModal = openMountModal;
module.exports.openSystemModal = openSystemModal;