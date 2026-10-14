export function fitText(text: string, lines = 1) {
  const longestWord = Math.max(0, ...text.split(/\s+/).map(w => w.length))
  return { '--fit-chars': Math.max(longestWord, Math.ceil(text.length / lines)) }
}
