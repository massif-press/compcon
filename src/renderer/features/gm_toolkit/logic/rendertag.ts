const tags: {
  id: string;
  name: string;
  description: string;
}[] = require('lancer-data').tags;

export default function renderTag(
  tag: { id: string; val?: number | number[] },
  tier?: number,
): string {
  const tagData = tags.find(t => t.id === tag.id);
  if (!tagData) return tag.id;

  if (!tag.val) return tagData.name;

  const valuePerTier = Array.isArray(tag.val);
  let valueString: string;
  if (valuePerTier) {
    const tagValues = tag.val as number[];
    if (tier !== undefined) {
      const index = Math.min(tier, tagValues.length - 1);
      valueString = tagValues[index].toString();
    } else {
      valueString = tagValues.join('/');
    }
  } else {
    valueString = (tag.val as number).toString();
  }
  return tagData.name.replace('{VAL}', valueString);
}
