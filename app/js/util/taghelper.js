var tags = require("../../resources/data/tags.json");

function expand(e) {
  return Array.isArray(e) ? expandArray(e) : expandItem(e);
}


function expandItem(item) {
  if (!item.tags) return item;
    var fullTags = [];
    for (var i = 0; i < item.tags.length; i++) {
      var cTag = item.tags[i];
      var tag = tags.find(t => t.id == cTag.id)
      if (tag) {
        tag.name = tag.name.replace(new RegExp('X', 'g'), cTag.val);
        tag.description = tag.description.replace(new RegExp('X', 'g'), cTag.val);
        fullTags.push(tag)
      } else {
        console.error(`Cannot find item: ${item.name} tag with id: ${cTag.id}`);
      }
    }
  item.tags = fullTags;
  return item;
}

function expandArray(arr) {
  for (var i = 0; i < arr.length; i++) {
    var fullTags = [];
    for (var j = 0; j < arr[i].tags.length; j++) {
      var cTag = arr[i].tags[j];
      var tag = tags.find(t => t.id == cTag.id)
      if (tag) {
        tag.name = tag.name.replace(new RegExp('X', 'g'), cTag.val);
        tag.description = tag.description.replace(new RegExp('X', 'g'), cTag.val);
        fullTags.push(tag)
      } else {
        console.error(`Cannot find item: ${arr[i].name} tag with id: ${cTag.id}`);
      }
    }
    arr[i].tags = fullTags;
  }
  return arr;
}

module.exports.expand = expand;
