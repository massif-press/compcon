const GenerateContrastingColors = (
  n,
  g = 0.618033988749895,
  c = [],
  hsl = (h, s, l) => {
    if (s === 0) return `#${(l * 255).toString(16).repeat(3)}`;
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s,
      p = 2 * l - q,
      hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
    return (
      '#' +
      [h + 1 / 3, h, h - 1 / 3]
        .map((x) =>
          Math.round(hue2rgb(p, q, x) * 255)
            .toString(16)
            .padStart(2, '0')
        )
        .join('')
    );
  }
) => {
  for (let i = 0; i < n; i++) {
    const h = (Math.random() + i * g) % 1,
      s = 0.5 + Math.random() * 0.5,
      l = 0.5 + Math.random() * 0.5;
    c.push(hsl(h, s, l));
  }
  return c;
};

export { GenerateContrastingColors };
