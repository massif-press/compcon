const order = ['gms', 'ips-n', 'ssc', 'horus', 'ha'];

export const ManufacturerSort = (mArr: any[]) =>
  mArr.sort((a, b) => {
    const indexA = order.indexOf(a.Source.toLowerCase());
    const indexB = order.indexOf(b.Source.toLowerCase());

    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    } else if (indexA !== -1) {
      return -1;
    } else if (indexB !== -1) {
      return 1;
    } else return a.Source.toLowerCase().localeCompare(b.Source.toLowerCase());
  });
