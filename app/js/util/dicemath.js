function parse(dmg) {
  var minDmgs = {};
  var maxDmgs = {};
  var avgDmgs = {};

  for (key in dmg) {
    var e = dmg[key].toString();
    var bSplit = e.split('+'); //split value for flat bonus
    var plus = (bSplit && bSplit.length > 1) ? parseInt(bSplit[1]) : 0; //collect flat bonus, if any
    var dice = bSplit[0];
    if (!dice.includes('d')) { //if dmg is flat
      var val = parseInt(dice) + plus;
      minDmgs[key] = val;
      maxDmgs[key] = val;
      avgDmgs[key] = val;
    } else {
      var diceNum = parseInt(dice.split('d')[0]);
      var diceSize = parseInt(dice.split('d')[1]);
      minDmgs[key] = (diceNum + plus);
      maxDmgs[key] = ((diceNum * diceSize) + plus)
      avgDmgs[key] = ((((diceSize + 1) / 2) * diceNum) + plus)
    }
  }

  minDmgs.total = minDmgs.kinetic + minDmgs.energy + minDmgs.explosive + minDmgs.variable;
  maxDmgs.total = maxDmgs.kinetic + maxDmgs.energy + maxDmgs.explosive + maxDmgs.variable;
  avgDmgs.total = avgDmgs.kinetic + avgDmgs.energy + avgDmgs.explosive + avgDmgs.variable;

  return {
    min: minDmgs,
    max: maxDmgs,
    avg: avgDmgs
  }
}

module.exports.parse = parse;