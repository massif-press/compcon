const $ = require('jquery');
const io = require("../util/io")
const Expander = require("../util/expander");
const Handlebars = require("handlebars");
//data
const shells = require("../../extraResources/data/shells.json");
//templates
const newConfigTemplate = io.readTemplate('wizards/new-config');
const shellTemplate = io.readTemplate('wizards/shells');

function init(pilot) {
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
    avaialbleShells.push(shells.find(s => s.id === availableShellIDs[i]));
  }

  var shellTemp = Handlebars.compile(shellTemplate);
  $("#shell-select").html(shellTemp({
    "shells": avaialbleShells
  }));

  Expander.bindCarets();

  //everest bonus

  //name and details

  //confirm


    //name
    // $("line-input").off();
    // $('.line-input').keyup(function () {
    //   if ($('#callsign-input').val().length && $('#name-input').val().length) $(`.wizard-btn[data-step='2']`).removeClass('disabled').addClass('btn');
    //   else $(`.wizard-btn[data-step='2']`).addClass('disabled').removeClass('btn');
    // })

  //save/load/new
  //select shell
  //name/notes/image
  //confirm
}

module.exports = init;