var electron = require('electron')
var path = require('path')
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

$("#about-btn").click(function () {
  var modalID = $(this).data("modal");
  $('#' + modalID).css("display", "block");
});

$('.close').click(function () {
  var modalID = $(this).data("modal");
  $('#' + modalID).css("display", "none");
});


$("#catalog-btn").click(function () {
  let catalogWindow = new electron.remote.BrowserWindow({
    'height': 800,
    'minHeight': 720,
    'width': 1400,
    'minWidth': 1280
  })
    catalogWindow.setMenu(null);

  catalogWindow.loadFile('./app/catalog.html')
  catalogWindow.on('close', function () {
    win = null
  })
  catalogWindow.show()
});

$(document).on('click', 'a[href^="http"]', function (event) {
  event.preventDefault();
  electron.shell.openExternal(this.href);
});