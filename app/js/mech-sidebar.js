//TODO: move this
var charts = require('chart.js');

var $ = require("jquery");
var Handlebars = require("handlebars");
var configs = require("../resources/data/configurations.json");
var shells = require("../resources/data/shells.json");

Handlebars.registerHelper('checkStripes', function (status) {
  var ok = status.toUpperCase() === "AVAILABLE" || status.toUpperCase() === "ACTIVE";
  return ok ? "" : "warning-stripes";
});

Handlebars.registerHelper('checkAvail', function (status) {
  if (status.toUpperCase() === "AVAILABLE") 
    return ""
  else if (status.toUpperCase() === "ACTIVE")
    return "active"
  else if (status.toUpperCase() === "DESTROYED")
    return "destroyed"
  else
    return "unavailable"
  });

function loadMecha(idArray) {
  var configArray = [];

  for (var i = 0; i < configs.length; i++) {
    configs[i].shell = shells.find(s => s.id == configs[i].shell_id);;
  }

  for (var i = 0; i < idArray.length; i++) {
    var id = idArray[i];
    configArray.push(configs.find(function (c) { return c.id === id; }))
  }

  console.log(configArray[0].shell.name);

  var template = Handlebars.compile($('#mech-sidebar-template').html());

  $("#mech-sidebar-output").html(template({"configs": configArray}));

  $('.mech-expander').click(function () {
    if ($(this).hasClass('btn')) {
      toggleExpander('mech', this);

      $('.main').load('./resources/html/mech-sheet.html', function () {
        //TODO: offload these
        setCharts();
        bindEquipmentExpanders();
      });
    }
  });

}

//TODO: refactor
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

//TODO: offload these
function bindEquipmentExpanders() {
  $('.equip-expander-header').click(function () {
    $(this).toggleClass('sweep-btn bold');
    var parent = $(this).closest('.equip-expander');
    $(parent).toggleClass('open');
    $($(parent).find(".equip-open-info")).toggle("swing");
  });
}

function setCharts() {
  var ctx = document.getElementById("damagechart").getContext('2d');
  var damagechart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ["M", 1, 5, 10, 15, 20, 25, 30, "35+"],
      datasets: [{
          label: 'Maximum Damage',
          data: [10, 15, 20, 15, 11, 11, 10, 5, 0, 0],
          backgroundColor: '#F2B13433',
          borderColor: '#F2B134',
          borderWidth: 1
        },
        {
          label: 'Average Damage',
          data: [5, 8.2, 11.3, 10, 7, 2.2, 1.8, 1.1, 0],
          backgroundColor: '#F3573B33',
          borderColor: '#F3573B',
          borderWidth: 3,
          fill: false
        }
      ]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#5F909C'
          },
          gridLines: {
            color: '#0000001A'
          }
        }],
        xAxes: [{
          ticks: {
            fontColor: '#5F909C'
          },
          gridLines: {
            color: '#0000001A'
          }
        }]
      },
      legend: {
        labels: {
          fontColor: '#5F909C'
        }
      }
    }
  });

  var ctx = document.getElementById("rolechart").getContext('2d');
  var rolechart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Melee', 'Ranged', 'Support', 'Control', 'Repair'],
      datasets: [{
        data: [7, 9, 4, 3, 4],
        backgroundColor: '#5F909C33',
        borderColor: '#5F909C',
        borderWidth: 1,
      }],
    },
    options: {
      scale: {
        ticks: {
          beginAtZero: true,
          suggestedMax: 10,
          display: false
        },
        pointLabels: {
          fontColor: '#5F909C'
        },
        angleLines: {
          color: '#0000001A'
        },
        gridLines: {
          color: '#0000001A'
        },
      },
      legend: {
        display: false
      }
    }
  });
}


module.exports = loadMecha;