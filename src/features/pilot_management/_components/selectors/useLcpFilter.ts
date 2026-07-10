type LcpConfig = { packList: { packID?: string; packName?: string }[] } | null | undefined

export function filterByLcpConfig<T>(items: T[], config: LcpConfig): T[] {
  if (!config) return [...items]
  const packIDs = new Set(config.packList.map((y) => y.packID))
  const packNames = new Set(config.packList.map((y) => y.packName))
  return items.filter((x: any) => {
    if (!x.InLcp) return true
    const brew = x.Brew ?? x
    const id = brew.LcpId ?? brew.LcpID
    return (id != null && packIDs.has(id)) || packNames.has(brew.LcpName)
  })
}
