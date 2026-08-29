const BRACE_PATTERN = /(\{.*?\})/gi

// braced groups, plus unbraced tier triples (`1/2/3`) as found in NPC feature text
const LOOSE_PATTERN = /\{.*?\}|\d+\/\d+\/\d+/g

const TIER_PATTERN = /\{\d+\/\d+\/\d+\}/g

const resolve = (str: string, tier: number | undefined, pattern: RegExp): string => {
  if (!str) return ''
  if (typeof str !== 'string') return JSON.stringify(str)
  let fmt = str
  const m = str.match(pattern)
  if (m) {
    m.forEach(x => {
      if (tier) {
        const tArr = x.replace('{', '').replace('}', '').split('/')
        const val = tArr[tier - 1] ?? tArr[tArr.length - 1]
        fmt = fmt.replace(x, `<b class="text-accent">${val}</b>`)
      } else fmt = fmt.replace(x, x.replace('{', '<b class="text-accent">').replace('}', '</b>'))
    })
  }
  return fmt
}

const ByTier = (str: string, tier?: number): string => resolve(str, tier, BRACE_PATTERN)

const ByTierLoose = (str: string, tier?: number): string => resolve(str, tier, LOOSE_PATTERN)

const ByTierArray = (arr: string, tier?: number): string => {
  if (!arr) return ''
  let fmt = arr
  if (!tier) return arr
  if (typeof arr === 'string') {
    try {
      fmt = JSON.parse(arr)
    } catch (e) {
      fmt = arr.split(',') as any
    }
  }
  if (!Array.isArray(fmt)) return arr
  return fmt[tier - 1]
}

const replaceVal = (str: string, val: string | number): string => {
  if (!str) return ''
  return str.replace(/{VAL}/g, String(val))
}

const resolveTier = (str: string, tier: number): string => {
  if (!str || !tier) return str || ''
  return str.replace(TIER_PATTERN, match => {
    const vals = match.slice(1, -1).split('/')
    return vals[tier - 1] ?? vals[vals.length - 1] ?? match
  })
}

export { ByTier, ByTierLoose, ByTierArray, replaceVal, resolveTier }
