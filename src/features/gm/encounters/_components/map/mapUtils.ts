export function getColor(flags: string[]): string {
  if (flags.includes('Deployment')) return '#B71C1C'
  if (flags.includes('Ingress')) return '#0277BD'
  if (flags.includes('Egress')) return '#00C853'
  if (flags.includes('Objective')) return '#F57F17'
  if (flags.includes('Obstruction')) return '#546E7A'
  return 'rgba(0, 0, 0, 0)'
}

export function findNearest(
  target: { x: number; y: number },
  arr: Array<{ x: number; y: number }>
): (typeof arr)[number] | null {
  let nearestPoint = null
  let minDistance = Infinity
  for (let i = 0; i < arr.length; i++) {
    const point = arr[i]
    const distance = Math.sqrt(Math.pow(target.x - point.x, 2) + Math.pow(target.y - point.y, 2))
    if (distance < minDistance) { nearestPoint = point; minDistance = distance }
  }
  return nearestPoint
}
