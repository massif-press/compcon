const ByTier = (str: string, tier?: number): string => {
  if (!str) return '';
  let fmt = str;
  const perTier = /(\{.*?\})/g;
  const m = str.match(perTier);
  if (m) {
    m.forEach((x) => {
      if (tier) {
        const tArr = x.replace('{', '').replace('}', '').split('/');
        fmt = fmt.replace(x, `<b class="text-accent">${tArr[tier - 1]}</b>`);
      } else fmt = fmt.replace(x, x.replace('{', '<b class="text-accent">').replace('}', '</b>'));
    });
  }
  return fmt;
};

export default ByTier;
