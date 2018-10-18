var $ = require("jquery");
var Handlebars = require("handlebars");
var Chart = require('chart.js');
var Stats = require('./util/stats');
var Tags = require('./util/taghelper');
var Dicemath = require('./util/dicemath');
var weapons = require("../resources/data/weapons.json");
var systems = require("../resources/data/systems.json");

Handlebars.registerHelper('longSource', function (source) {
  switch (source) {
    case "IPS-N": return "IPS-Northstar"
    case "SSC": return "Smith Shimano Corpo"
    case "HA": return "Harrison Armory"
    case "GMS": return "General Massive Systems"
    default: return source
  }
});

Handlebars.registerHelper('ifElse', function (a, b) {
  return a ? a : b;
});

Handlebars.registerHelper('plusMinus', function (val) {
  return val >= 0 ? "+" + val : "-" + val;
});

Handlebars.registerHelper('balloonSize', function (str) {
  str.split(' ');
  if (str.length < 10) return 'small';
  if (str.length < 30) return 'medium';
  if (str.length < 100) return 'large';
  return 'xlarge';
});

Handlebars.registerHelper('dmgFormat', function (str) {
  str = str.replace('Kinetic', '<span class="kinetic">Kinetic</span>');
  str = str.replace('Energy', '<span class="energy">Energy</span>');
  str = str.replace('Explosive', '<span class="explosive">Explosive</span>');
  str = str.replace('Variable', '<span class="variable">Variable</span>');
  str = str.replace('Heat', '<span class="heat">Heat</span>');
  str = str.replace('Burn', '<span class="burn">Burn</span>');
  return str;
});

Handlebars.registerHelper('dmgRange', function (arr) {
  if (!arr) return "";
  if (!arr.length) return "";
  var d = Dicemath.parse(arr);

  var totalMin = d.min.slice(0 , 4).reduce((a, b) => a + b, 0);
  var totalMax = d.max.slice(0, 4).reduce((a, b) => a + b, 0);
  var totalAvg = d.avg.slice(0, 4).reduce((a, b) => a + b, 0);

  var h = d.min[5] > 0 ? `, + ${d.min[5]} - ${d.max[5]} Heat` : "";
  var ha = d.min[5] > 0 ? ` (${d.avg[5]} Heat)` : ''

  return `${totalMin} - ${totalMax}${h}   (${totalAvg}) ${ha}`;
});


function loadMech(config, pilot) {
  var stats = Stats.getStats(config, pilot)

  var wp = [];
  var sys = [];
  
  for (var i = 0; i < config.weapons.length; i++) {
    wp.push(weapons.find(w => w.id == config.weapons[i]));
  }

  for (var i = 0; i < config.systems.length; i++) {
    sys.push(systems.find(s => s.id == config.systems[i]));
  }

  wp = Tags.expand(wp);
  sys = Tags.expand(sys);

  var info_template = Handlebars.compile($('#mech-info-template').html());
  $("#mech-info-output").html(info_template(config));

  var stat_template = Handlebars.compile($('#mech-stats-template').html());
  $("#mech-stats-output").html(stat_template(stats));

  var gear_template = Handlebars.compile($('#mech-gear-template').html());
  $("#mech-gear-output").html(gear_template({
    "weapons": wp,
    "systems": sys,
    "shell": config.shell
  }));


  setCharts();
  bindEquipmentExpanders();
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

module.exports = loadMech;