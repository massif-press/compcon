const BRACE_PATTERN = /(\{.*?\})/gi

const TIER_PATTERN = /\{\d+\/\d+\/\d+\}/g

const ByTier = (str: string, tier?: number): string => {
  if (!str) return ''
  if (typeof str !== 'string') return JSON.stringify(str)
  let fmt = str
  const m = str.match(BRACE_PATTERN)
  if (m) {
    m.forEach(x => {
      if (tier) {
        const tArr = x.replace('{', '').replace('}', '').split('/')
        fmt = fmt.replace(x, `<b class="text-accent">${tArr[tier - 1]}</b>`)
      } else fmt = fmt.replace(x, x.replace('{', '<b class="text-accent">').replace('}', '</b>'))
    })
  }
  return fmt
}

const ByTierArray = (arr: string, tier?: number): string => {
  if (!arr) return ''
  let fmt = arr
  if (!tier) return arr
  if (typeof arr === 'string') fmt = JSON.parse(arr)
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

export { ByTier, ByTierArray, replaceVal, resolveTier, BRACE_PATTERN, TIER_PATTERN }
