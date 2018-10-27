var tagData = require("../../resources/data/tags.json");

function expand(e) {
  return Array.isArray(e) ? expandArray(e) : expandItem(e);
}

function parse(str) {
  //inline tags -- enclosed by #
  var inlineRegex = /\#(.*?)\#/gm;
  var inlineMatch, inlineMatches = [];

  while ((inlineMatch = inlineRegex.exec(str)) != null) {
    
    var id = inlineMatch[0].trim().replace(/#/g, '');
    var val = id.match(/\((.*?)\)/g) ? id.match(/\((.*?)\)/g)[0] : '';

    var tag = tagData.find(t => t.id == id)
    if (tag) {
      tag.name = tag.name.replace(new RegExp('X', 'g'), val);
      tag.description = tag.description.replace(new RegExp('X', 'g'), val);
      var html = `<span class='tag'><a href='#' data-balloon-length='${balloonSize(tag.description)}' data-balloon='${tag.description}' data-balloon-pos='up'>${tag.name}</a></span>`
      str = str.replace(inlineMatch[0], html);
    } else {
      console.error(`Cannot find tag with id: ${id}`);
    }
  }

  //tag blocks -- enclosed by %
  var regex = /\%(.*?)\%/gm;
  var match, matches = [];

  while ((match = regex.exec(str)) != null) {
    var ids = match[0].trim().replace(/%/g, '').split(' ');
      for (var i = 0; i < ids.length; i++) {
      var id = ids[i];
      var val = id.match(/\((.*?)\)/g) ? id.match(/\((.*?)\)/g)[0] : false;
      if (!val) matches.push({"id" : id});
      else {
        matches.push({
          "id": id.replace(val, ''),
          "val": parseInt(val)
        })
      }
    }
  }

  if (!matches.length) return str;

  str = str.replace(regex, '');

  var tags = []
  for (var i = 0; i < matches.length; i++) {
    var cTag = matches[i];
    var tag = tagData.find(t => t.id == cTag.id)
    if (tag) {
      tag.name = tag.name.replace(new RegExp('X', 'g'), cTag.val);
      tag.description = tag.description.replace(new RegExp('X', 'g'), cTag.val);
      tags.push(tag)
    } else {
      console.error(`Cannot find tag with id: ${cTag.id}`);
    }
  }

  str += `<br><div class='tag-div'>`
  for (var i = 0; i < tags.length; i++) {
    var bSize = balloonSize(tags[i].description)
    str += `<span class='tag'><a href='#' data-balloon-length='${bSize}' data-balloon='${tags[i].description}' data-balloon-pos='up'>${tags[i].name}</a></span>`
  }
  str += `</div>`
  return str;
}


function expandItem(item) {
  if (!item.tags) return item;
    var fullTags = [];
    for (var i = 0; i < item.tags.length; i++) {
      var cTag = item.tags[i];
      var tag = tagData.find(t => t.id == cTag.id)
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
    if(!arr[i]) console.log(arr, i);
    
    for (var j = 0; j < arr[i].tags.length; j++) {
      var cTag = arr[i].tags[j];
      var tag = tagData.find(t => t.id == cTag.id)
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

function balloonSize(str) {
  str.split(' ');
  if (str.length < 10) return 'small';
  if (str.length < 30) return 'medium';
  if (str.length < 100) return 'large';
  return 'xlarge';
};

module.exports.expand = expand;
module.exports.parse = parse;
