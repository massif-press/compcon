function parse(diceArray) {
  var minDmgs = [];
  var maxDmgs = [];
  var avgDmgs = [];

  for (var i = 0; i < diceArray.length; i++) {
    var e = diceArray[i].toString();
    var bSplit = e.split('+'); //split value for flat bonus
    var plus = (bSplit && bSplit.length > 1) ? parseInt(bSplit[1]) : 0; //collect flat bonus, if any
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

module.exports.parse = parse;