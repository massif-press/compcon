var Chart = require('chart.js');
var Dice = require('./dicemath');

function getCharts(weapons) {

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

  var ranges = [0];
  var maxDmgAtRange = [0];
  var avgDmgAtRange = [0];

  var maxDamageByMount = {};
  var minDamageByMount = {};

  for (var i = 0; i < weapons.length; i++) {
    var w = weapons[i];
    var dmg = Dice.parse(w.damage);
    var range = 0; 
    if (Number.isInteger(w.range)) range = w.range;
    else {
      var val = parseFloat(w.range.split(',')[0]);
      range = (val === NaN) ? 0 : val;
    }

    for (var key in dmg.min) {
      minDmgByType[key] += dmg.min[key];
      maxDmgByType[key] += dmg.max[key];
    }

    if (ranges.indexOf(range) === -1) {
      ranges.push([range]);
      maxDmgAtRange.push([dmg.max.total]);
      avgDmgAtRange.push([dmg.avg.total]);
    }

    for (var j = 0; j < ranges.length; j++) {
      if(range[i] <= range) {
        maxDmgAtRange[i] += dmg.max.total;
        avgDmgAtRange[i] += dmg.avg.total;
      }
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

  ranges[0] = "M";
  rangeChart(ranges, maxDmgAtRange, avgDmgAtRange)

  mountChart(Object.values(maxDamageByMount), Object.values(minDamageByMount), Object.keys(minDamageByMount))
  roleChart();
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
              borderWidth: 1
            },
            {
              label: 'Average Damage',
              data: avgDmg,
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
    }

    function mountChart(minDmgs, maxDmgs, labels) {
      console.log(labels);
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
            position: "left",
            labels: {
              fontColor: '#5F909C',
              padding: 30
            }
          }
        }
      });
    }

  function roleChart() {
  var ctx = document.getElementById("rolechart").getContext('2d');
  new Chart(ctx, {
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
