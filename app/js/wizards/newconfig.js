const { dialog } = require('electron').remote;
const $ = require('jquery');
const io = require("../util/io")
const Expander = require("../util/expander");
const Handlebars = require("handlebars");
const Sidebar = require("../mech-sidebar");
//data
const shells = require("../../extraResources/data/shells.json");
//templates
const newConfigTemplate = io.readTemplate('wizards/new-config');
const shellTemplate = io.readTemplate('wizards/shells');

function init(pilot) {
  var selectedShellID;
  var selectedShellName;
  var everestBonus;
  var mechImageFilename;

  var ncTemplate = Handlebars.compile(newConfigTemplate);
  $("#ncw-modal-body").html(ncTemplate());

  $('#newConfigModal').css("display", "block");

  $('.wizard-btn').off();
  $('.wizard-btn').click(function () {
    if ($(this).hasClass('disabled')) return;
    let step = $(this).data("step");
    $(".nc-wizard").hide()
    $(`.nc-wizard[data-step='${step}']`).show();
  });

  Expander.bindModalClose()

  //shells
  var availableShellIDs = ['everest'];
  for (var i = 0; i < pilot.licenses.length; i++) {
    var l = pilot.licenses[i];
    if (l.level >= 2) availableShellIDs.push(l.name.toLowerCase());
  }
  var avaialbleShells = [];
  for (let i = 0; i < availableShellIDs.length; i++) {
    var s = shells.find(s => s.id === availableShellIDs[i]);
    if (availableShellIDs[i] === "everest") s.isEverest = true;
    avaialbleShells.push(s);
  }

  var shellTemp = Handlebars.compile(shellTemplate);
  $("#shell-select").html(shellTemp({
    "shells": avaialbleShells
  }));

  $('.shell-item').off().click(function(){
    var e = $(this);
    var step = e.data("id") === "everest" ? 2 : 3;
    $('#shell-select-next').removeClass('disabled').addClass('btn').data("step", step);
    $('.shell-item').removeClass("skill-upgrade")
    e.addClass("skill-upgrade");
    $('#shell-selection-text').text(e.data("name") + " SELECTED")
    selectedShellID = e.data("id");
    selectedShellName = e.data("name");
  })

  //everest bonus
  $('.everest-bonus').off().click(function () {
    var e = $(this);
    $(`.wizard-btn[data-step='3']`).removeClass('disabled').addClass('btn');
    $('.everest-bonus').removeClass("skill-upgrade")
    e.addClass("skill-upgrade");
    everestBonus = e.data("skill");
  })

  //name and details
  $("line-input").off();
  $('.line-input').keyup(function () {
    if ($('#config-name-input').val().length) $(`.wizard-btn[data-step='4']`).removeClass('disabled').addClass('btn');
    else $(`.wizard-btn[data-step='4']`).addClass('disabled').removeClass('btn');
  })

  $(`.wizard-btn[data-step='4']`).click(function () { loadConfirmStep($('#config-name-input').val(), selectedShellName, everestBonus) })

  $('#mech-img-select').off()
  $('#mech-img-select').click(function () {
    var filepath = dialog.showOpenDialog({
      defaultPath: __dirname + "..img/pilots",
      title: "Select Portrait Image",
      filters: [
        { name: 'Images', extensions: ['jpg', 'png', 'gif', 'bmp', 'jpeg'] }
      ],
      properties: ['openFile']
    });

    if (filepath) {
      mechImageFilename = filepath[0];
      $("#mech-img-filename").text(filepath[0].split('\\').pop().split('/').pop());
    };
  });
  
  //confirm
  $("#confirm-new-config").click(function(){
    Sidebar.addConfig(pilot.id, {
      name: $('#config-name-input').val(),
      notes: $('#config-notes').val(),
      mounts: getConfigMounts(selectedShellID),
      imgFilepath: mechImageFilename,
      shellID: selectedShellID,
      everest_bonus: everestBonus
    })
    $('#newConfigModal').css("display", "none");
  })

  Expander.bindCarets();
}

function loadConfirmStep(configName, shellName, everestBonus) {
  $('#confirm-name-text').html(`<span class="mech-name">${configName}</span><br><span class="big-subtitle">${shellName}</span><br>`)
  if (everestBonus) $('#confirm-everest-bonus').html(`+1 ${everestBonus.toUpperCase()} (EVEREST Shell)`)
}

function getConfigMounts(shellID) {
  var mounts = []
  var s = shells.find(x => x.id === shellID);
  for (var i = 0; i < s.mounts.length; i++) {
    var m = s.mounts[i];
    if (m === 'Auxiliary') mounts.push({mount: m}, {mount: m});
    else mounts.push({mount: m});
  }
  for (var i = 0; i < mounts.length; i++) {
    mounts[i].mount_index = i;
  }
  return mounts;
}

module.exports = init;