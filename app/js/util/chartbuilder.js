//this is just a mess.

var Chart = require('chart.js');
var Dice = require('./dicemath');

function getCharts(weapons, items) {

  var aptitudes = {
    "melee": 0,
    "ranged": 0,
    "tech": 0,
    "support": 0,
    "control": 0,
    "repair": 0
  };

  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    for (key in item.aptitude) {
      aptitudes[key] += item.aptitude[key];
    }
  }

  var minDmgByType = {
    "kinetic": 0,
    "energy": 0,
    "explosive": 0,
    "variable": 0,
    "burn": 0,
    "heat": 0,
  }
  var maxDmgByType = {
    "kinetic": 0,
    "energy": 0,
    "explosive": 0,
    "variable": 0,
    "burn": 0,
    "heat": 0,
  }

  var dmgAtRange = [];
  var maxDamageByMount = {};
  var minDamageByMount = {};

  for (var i = 0; i < weapons.length; i++) {
    var w = weapons[i];
    var dmg = Dice.parse(w.damage);
    var range = 0;
    if (Number.isInteger(w.range)) range = w.range;
    else {
      var val = parseFloat(w.range.replace("Line", "").replace("Cone", "").split(',')[0].trim());
      range = (isNaN(val)) ? 0 : val;
    }


    for (var key in dmg.min) {
      minDmgByType[key] += dmg.min[key];
      maxDmgByType[key] += dmg.max[key];
    }

    var r = dmgAtRange.findIndex(item => item.range == range);
    if (r > -1) {
      dmgAtRange[r].min += dmg.min.total;
      dmgAtRange[r].max += dmg.max.total;
      dmgAtRange[r].avg += dmg.avg.total;
    } else {
      var nr = {
        "range": range,
        "min": dmg.min.total,
        "max": dmg.max.total,
        "avg": dmg.avg.total
      }
      dmgAtRange.push(nr);
    }

    if (maxDamageByMount[w.mount]) maxDamageByMount[w.mount] += dmg.max.total;
    else maxDamageByMount[w.mount] = dmg.max.total;

    if (minDamageByMount[w.mount]) minDamageByMount[w.mount] += dmg.min.total;
    else minDamageByMount[w.mount] = dmg.min.total;
  }

  typeChart([
    minDmgByType.kinetic + minDmgByType.variable,
    minDmgByType.energy + minDmgByType.variable,
    minDmgByType.explosive + minDmgByType.variable,
    minDmgByType.burn,
    minDmgByType.heat,
  ],
    [
      maxDmgByType.kinetic + maxDmgByType.variable,
      maxDmgByType.energy + maxDmgByType.variable,
      maxDmgByType.explosive + maxDmgByType.variable,
      maxDmgByType.burn,
      maxDmgByType.heat,
    ]
  );

  dmgAtRange.sort(function (a, b) {
    return a.range - b.range;
  });

  rangeChart(dmgAtRange.map(a => a.range), dmgAtRange.map(a => a.max), dmgAtRange.map(a => a.avg))

  mountChart(Object.values(maxDamageByMount), Object.values(minDamageByMount), Object.keys(minDamageByMount))
  roleChart(aptitudes);
}


function typeChart(minArr, maxArr) {
  var ctx = document.getElementById("damage-type-chart").getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: {
      datasets: [{
        data: maxArr,
        backgroundColor: [
          '#ABB7B733',
          '#74b9ff33',
          '#F2B13433',
          '#F3573B33',
          '#832e2e33'
        ],
        borderColor: [
          '#ABB7B7',
          '#74b9ff',
          '#F2B134',
          '#F3573B',
          '#832e2e'
        ],
        hoverBackgroundColor: [
          '#ABB7B7',
          '#74b9ff',
          '#F2B134',
          '#F3573B',
          '#832e2e'
        ],
        hoverBorderColor: '#fff',
        borderWidth: 1
      }, {
        data: minArr,
        backgroundColor: [
          '#ABB7B733',
          '#74b9ff33',
          '#F2B13433',
          '#F3573B33',
          '#832e2e33'
        ],
        borderColor: [
          '#ABB7B7',
          '#74b9ff',
          '#F2B134',
          '#F3573B',
          '#832e2e'
        ],
        hoverBackgroundColor: [
          '#ABB7B7',
          '#74b9ff',
          '#F2B134',
          '#F3573B',
          '#832e2e'
        ],
        hoverBorderColor: '#fff',
        borderWidth: 1
      }],
      labels: [
        'Kinetic',
        'Energy',
        'Explosive',
        'Burn',
        'Heat'
      ],

    },
    options: {
      rotation: 0.25 * Math.PI,
      legend: {
        position: "left",
        labels: {
          fontColor: '#5F909C',
          padding: 20
        }
      }
    }
  });
}

function rangeChart(ranges, maxDmg, avgDmg) {
  var i = ranges.length; 
  var adds = [0,0]
  while (i--) {
    adds[0] += maxDmg[i];
    adds[1] += avgDmg[i];
    maxDmg[i] = adds[0];
    avgDmg[i] = adds[1]
  }

  if (ranges[0] !== 0) {
    ranges.unshift("Melee");
    maxDmg.unshift(maxDmg[0]);
    avgDmg.unshift(avgDmg[0]);
  } else {
    ranges[0] = "Melee"
  }

  ctx = document.getElementById("damage-range-chart").getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ranges,
      datasets: [{
        label: 'Maximum Damage',
        data: maxDmg,
        backgroundColor: '#F2B13433',
        borderColor: '#F2B134',
        borderWidth: 1,
        cubicInterpolationMode: 'monotone',
        pointStyle: "triangle",
        pointRadius: 5,
        pointHitRadius: 8
      },
      {
        label: 'Average Damage',
        data: avgDmg,
        backgroundColor: '#F3573B33',
        borderColor: '#F3573B',
        borderWidth: 3,
        fill: false,
        pointRadius: 5,
        pointHitRadius: 8
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
}

function mountChart(minDmgs, maxDmgs, labels) {
  ctx = document.getElementById("damage-mount-chart").getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: {
      datasets: [{
        data: minDmgs,
        backgroundColor: [
          '#ABB7B733',
          '#74b9ff33',
          '#F2B13433',
          '#F3573B33',
        ],
        borderColor: [
          '#ABB7B7',
          '#74b9ff',
          '#F2B134',
          '#F3573B',
        ],
        hoverBackgroundColor: [
          '#ABB7B7',
          '#74b9ff',
          '#F2B134',
          '#F3573B',
        ],
        hoverBorderColor: '#fff',
        borderWidth: 1
      }, {
        data: maxDmgs,
        backgroundColor: [
          '#ABB7B733',
          '#74b9ff33',
          '#F2B13433',
          '#F3573B33',
        ],
        borderColor: [
          '#ABB7B7',
          '#74b9ff',
          '#F2B134',
          '#F3573B',
        ],
        hoverBackgroundColor: [
          '#ABB7B7',
          '#74b9ff',
          '#F2B134',
          '#F3573B',
        ],
        hoverBorderColor: '#fff',
        borderWidth: 1
      }],
      labels: labels,

    },
    options: {
      legend: {
        rotation: -0.25 * Math.PI,
        position: "left",
        labels: {
          fontColor: '#5F909C',
          padding: 30
        }
      }
    }
  });
}

function roleChart(a) {
  var d = [a.melee + 1, a.ranged + 1, a.tech + 1, a.control + 1, a.support + 1, a.repair + 1];
  var ctx = document.getElementById("rolechart").getContext('2d');
  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Melee', 'Ranged', 'Tech', 'Control', 'Support', 'Repair'],
      datasets: [{
        data: d,
        backgroundColor: '#5F909C33',
        borderColor: '#5F909C',
        borderWidth: 1,
      }],
    },
    options: {
      tooltips: {enabled: false},
      scale: {
        ticks: {
          beginAtZero: true,
          suggestedMax: 8,
          display: false
        },
        pointLabels: {
          fontColor: '#5F909C'
        },
        angleLines: {
          color: '#00000033'
        },
        gridLines: {
          color: '#00000033'
        },
      },
      legend: {
        display: false
      }
    }
  });
}

module.exports = getCharts
