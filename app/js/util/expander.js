const $ = require('jquery');

function bindExpander(expanderType, element) {
  var e = $(element);
  e.toggleClass('open btn');
  $(e.find("." + expanderType + '-sub')).toggle();
  $(e.find("." + expanderType + '-open-info')).toggle("swing");

  $('.' + expanderType + '-expander').each(function () {
    if (this !== element && $(this).hasClass('open')) {
      e = $(this);
      e.toggleClass('open btn');
      $(e.find("." + expanderType + '-sub')).toggle();
      $(e.find("." + expanderType + '-open-info')).toggle("swing");
    }
  });
}

function bindEquipmentExpander() {
  $('.equip-expander-header').click(function () {
    e = $(this);
    e.toggleClass('sweep-btn bold');
    var parent = e.closest('.equip-expander');
    $(parent).toggleClass('open');
    $($(parent).find(".equip-open-info")).toggle("swing");
  });
}

module.exports.bind = bindExpander;
module.exports.bindEquipment = bindEquipmentExpander;