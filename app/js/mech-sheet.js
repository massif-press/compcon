const $ = require('jquery');
const Handlebars = require('handlebars');
const MountEditor = require('./mount-editor');
const io = require('./util/io');
// const Charts = require('./util/chartbuilder');
const Expander = require('./util/expander');
const MechBuilder = require("./util/mechbuilder");
//templates
const loadoutTemplate = io.readTemplate('mech-loadout');
const infoTemplate = io.readTemplate('mech-info');
const statsTemplate = io.readTemplate('mech-stats');
const shellModalTemplate = io.readTemplate('mech-shell-modal');

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
    e.click(function () { MountEditor.openMountModal(mech, e.data('mount-idx')) });
  })

  //bind system buttons
  $('.system-btn').each(function () {
    var e = $(this);
    e.off();
    e.click(function () { MountEditor.openSystemModal(mech, e.data('system-idx'), pilot.core_bonuses.includes("cb_shaping")); })
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


module.exports = loadMech;