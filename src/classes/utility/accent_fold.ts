const DIACRITICS = /[\u0300-\u036f]/g

export default function accentFold(s: string): string {
  return s ? s.normalize('NFD').replace(DIACRITICS, '') : ''
}

export function accentInclude(haystack: string, needle: string): boolean {
  return accentFold(haystack.toLowerCase()).includes(accentFold(needle.toLowerCase()))
}

export function unCamelCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1 $2')
}
