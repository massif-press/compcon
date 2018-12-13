const Handlebars = require('handlebars');
const io = require('./io');

function getSelectorModal(modalName, data, callback) {
  var template = "" //path join with modalname
  const template = io.readTemplate(template);

  if(!$("#selector-modal").length) $(".main").append('<div id="selector-modal"></div>');
  var sel_template = Handlebars.compile(template);
  $("#selector-modal").html(sel_template(data));

  $(`#${modalName}Modal`).css('display', 'block');

  $(`.modal-select`).click(function() {
    $(`.modal-select`).removeClass('selected');
    var e = $(this);
    e.addClass('selected');
    $(`#${modalName}-close`).data("val", e.data("val"));
  })
  
  $(`#${modalName}-close`).click(function () {
    $(`#${modalName}Modal`).css("display", "none");
    var r = $(this.data("val"));
    if (r) callback(r);
    console.error("No return value assigned from this modal")
    callback();
  });
}

module.exports.getSelectorModal = getSelectorModal;