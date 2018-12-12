const Expander = require("../util/expander");

function init() {

  $('.wizard-btn').off();
  $('.wizard-btn').click(function () {
    if ($(this).hasClass('disabled')) return;
    let step = $(this).data("step");
    $(".np-wizard").hide()
    $(`.np-wizard[data-step='${step}']`).show();
  });

  Expander.bindModalClose()

  //save/load/new
  //select shell
  //name/notes/image
  //confirm
}

module.exports = init;