const toJson = function (csv) {

  const lines = csv.split("\r");

  const result = [];

  const headers = lines[0].split(",");

  for (let i = 1; i < lines.length; i++) {

    const obj = {};
    const currentline = lines[i].split(",");

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }

    result.push(obj);

  }

  return result.filter(x => !!x.Name && !!x.Tier && x.Tier !== 'monthly');
}

export default { toJson }