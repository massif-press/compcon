const Handlebars = require('handlebars');


function getSelectorModal(modalName, template, data, callback) {
  const template = fs.readFileSync(`${__dirname}/templates/${template}.hbs`, "utf8");
  $(".main").append(template(data));
  
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
    if (r) callback($(this.data("retval")));
    console.error("No return value assigned from this modal")
    callback();
  });
}



module.exports.getSelectorModal = getSelectorModal;