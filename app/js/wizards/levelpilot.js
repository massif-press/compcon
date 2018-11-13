const $ = require('jquery');

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




}

module.exports.init = init