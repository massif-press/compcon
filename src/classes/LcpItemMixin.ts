import type { ContentPack } from './ContentPack'

export const DEFAULT_LCP_NAME = 'Lancer Core Book'

export interface ILcpTracked {
  LcpName: string
  InLcp: boolean
}

export function applyLcpTracking(
  target: ILcpTracked,
  pack?: ContentPack,
  defaultName: string = DEFAULT_LCP_NAME
): void {
  target.LcpName = pack?.Name || defaultName
  target.InLcp = !!pack
}
