const $ = require("jquery");
const Electron = require('electron')
const Helpers = require('./util/handlebar-helpers');

$(document).ready(function () {
  //loads all handlebars helpers.
  Helpers.init();

  $('.pilot-sidebar').load('./html/pilot-sidebar.html');
});

// force web links to open in the OS default browser
$(document).on('click', 'a[href^="http"]', function (event) {
  event.preventDefault();
  Electron.shell.openExternal(this.href);
});

// modal button
$(".modal-btn").click(function () {
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
  catalogWindow.loadFile('./app/html/catalog.html')
  catalogWindow.on('close', function () { win = null })
  catalogWindow.show()
  // catalogWindow.webContents.openDevTools()
});

