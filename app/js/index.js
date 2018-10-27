const $ = require("jquery");
const Electron = require('electron')
const Expander = require('./util/expander');
const Helpers = require('./util/handlebar-helpers');

$(document).ready(function () {
  Helpers.init();

  $('.pilot-sidebar').load('./html/pilot-sidebar.html', function() {
    $('.pilot-Expander').click(function () {
      if ($(this).hasClass('btn')) {
        Expander.bind('pilot', this);
      }
    });
  });
});

// force web links to open in the OS default browser
$(document).on('click', 'a[href^="http"]', function (event) {
  event.preventDefault();
  Electron.shell.openExternal(this.href);
});

// About modal button
$("#about-btn").click(function () {
  let modalID = $(this).data("modal");
  $('#' + modalID).css("display", "block");
});

$('.close').click(function () {
  let modalID = $(this).data("modal");
  $('#' + modalID).css("display", "none");
});

// Catalog button and window
$("#catalog-btn").click(function () {
  let catalogWindow = new Electron.remote.BrowserWindow({
    'height': 800,
    'minHeight': 720,
    'width': 1400,
    'minWidth': 1280
  })
  catalogWindow.setMenu(null);
  catalogWindow.loadFile('./app/html/catalog/index.html')
  catalogWindow.on('close', function () { win = null })
  catalogWindow.show()
});

