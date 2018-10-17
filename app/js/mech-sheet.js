var $ = require("jquery");
var Handlebars = require("handlebars");
var charts = require('chart.js');
var weapons = require("../resources/data/weapons.json");
var systems = require("../resources/data/systems.json");
var tags = require("../resources/data/tags.json");

// TODO:
// When loading this, take pilot(core), config, and shell data (and systems?) and combine to get final stats

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
  if (parseInt(val) === 0) return val;
  return val > 0 ? "+" + val : "-" + val;
});

Handlebars.registerHelper('dmgRange', function (arr) {
  console.log(arr);
  if (!arr) return "";
  if (!arr.length) return "";
  var d = diceDamageParser(arr);

  var totalMin = d.min.slice(0 , 4).reduce((a, b) => a + b, 0);
  var totalMax = d.max.slice(0, 4).reduce((a, b) => a + b, 0);
  var totalAvg = d.avg.slice(0, 4).reduce((a, b) => a + b, 0);

  var h = d.min[5] > 0 ? `, + ${d.min[5]} - ${d.max[5]} Heat` : "";
  var ha = d.min[5] > 0 ? ` (${d.avg[5]} Heat)` : ''

  return `${totalMin} - ${totalMax}${h}   (${totalAvg}) ${ha}`;
});


function loadMech(config) {
  console.log(config);

  var stats = {
    h: 1,
    a: 2,
    s: 3,
    e: 4,
    structure: 4,
    hp: 22,
    armor: 1,
    hp_core_bonus: 5,
    hp_level_bonus: 3,
    hp_hull_bonus: 4,
    stress: 4,
    heatcap: 7,
    heat_eng_bonus: 1,
    overcharge_active: 1,
    overcharge_remaining: 3,
    speed: 7,
    evasion: 8,
    edef: 8,
    repcap: 7,
    targeting: 1,
    speed_agi_bonus: 1,
    evasion_agi_bonus: 0,
    edef_sys_bonus: 1,
    repcap_eng_bonus: 1,
    targeting_eng_bonus: 1,
    max_sp: 7,
    grapple: 0,
    ram: 0,
    sp_shell: 6,
    sp_core_bonus: 1
  }

  var wp = [];
  
  for (var i = 0; i < config.weapons.length; i++) {
    wp.push(weapons.find(w => w.id == config.weapons[i]));
  }

  for (var i = 0; i < wp.length; i++) {
    var fullTags = [];
    for (var j = 0; j < wp[i].tags.length; j++) {
      //TODO: parse tags with correct numbers
      var tID = wp[i].tags[j];
      fullTags.push(tags.find(t => t.id == tID))
    }
    wp[i].tags = fullTags;
  }

  console.log(wp);

  var info_template = Handlebars.compile($('#mech-info-template').html());
  $("#mech-info-output").html(info_template(config));

  var stat_template = Handlebars.compile($('#mech-stats-template').html());
  $("#mech-stats-output").html(stat_template(stats));

  var weapons_template = Handlebars.compile($('#mech-weapons-template').html());
  $("#mech-weapons-output").html(weapons_template({"weapons": wp}));

  setCharts();
  bindEquipmentExpanders();


}

function diceDamageParser(diceArray) {
  var minDmgs = [];
  var maxDmgs = [];
  var avgDmgs = [];

  for (var i = 0; i < diceArray.length; i++) {
    var e = diceArray[i].toString();
    var bSplit = e.split('+'); //split value for flat bonus
    var plus = bSplit > 1 ? parseInt(bSplit[1].substring(1)) : 0; //collect flat bonus, if any
    var dice = bSplit[0];
    if (!dice.includes('d')) { //if dmg is flat
      var val = parseInt(dice) + plus;
      minDmgs.push(val);
      maxDmgs.push(val);
      avgDmgs.push(val)
    } else {
      var diceNum = parseInt(dice.split('d')[0]);
      var diceSize = parseInt(dice.split('d')[1]);
      minDmgs.push(diceNum + plus);
      maxDmgs.push((diceNum * diceSize) + plus)
      avgDmgs.push((((diceSize + 1) / 2) * diceNum) + plus)
    }
  }

  return {
    min: minDmgs,
    max: maxDmgs,
    avg: avgDmgs
  }
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