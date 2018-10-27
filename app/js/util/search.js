/*  Find an object in an array by property
**  Prefer this over Array.prototype.find()
**  @param {array} arr - array of data objects (from JSON)
**  @param {string} prop - name of the property to search against
**  @param {any} val - value to match against (obj.prop)  
*/ 
function where(arr, prop, val) {
  if (!Array.isArray(arr) || arr.length === 0) {
    console.error("First parameter is not an array, or is empty");
    return null;
  }

  var res = arr.find(function (t) {return t[prop] === val;});

  if (!res) {
    console.error(`Array does not contain element with property ${prop} of value ${val}`);
    return null;
  }
  
  return res;
}

function byID(arr, val) {
  return where(arr, "id", val);
}


module.exports.where = where;
module.exports.byID = byID;