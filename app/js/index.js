var $ = require("jquery");


$(document).ready(function () {
  $('.pilot-sidebar').load('./resources/html/pilot-sidebar.html', function() {
    $('.pilot-expander').click(function () {
      if ($(this).hasClass('btn')) {
        toggleExpander('pilot', this);
      }
    });
  });
});



function toggleExpander(expanderType, element) {
  $(element).toggleClass('open btn');
  $($(element).find("." + expanderType + '-sub')).toggle();
  $($(element).find("." + expanderType + '-open-info')).toggle("swing");

  $('.' + expanderType + '-expander').each(function () {
    if (this !== element && $(this).hasClass('open')) {
      $(this).toggleClass('open btn');
      $($(this).find("." + expanderType + '-sub')).toggle();
      $($(this).find("." + expanderType + '-open-info')).toggle("swing");
    }
  });
}
