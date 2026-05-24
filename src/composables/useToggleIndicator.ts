import { type MaybeRefOrGetter, toValue } from 'vue'

export function useToggleIndicator(
  size: MaybeRefOrGetter<string | undefined>,
  color: MaybeRefOrGetter<string | undefined>,
  activeColor: MaybeRefOrGetter<string | undefined>,
  isOn: MaybeRefOrGetter<boolean>
) {
  function iconSize(icon: string) {
    let sz = 24
    if (icon === 'btn') sz += 8
    switch (toValue(size)) {
      case 'x-small': sz = 10; if (icon === 'btn') sz += 6; break
      case 'small': sz = 16; if (icon === 'btn') sz += 6; break
      case 'large': sz = 28; if (icon === 'btn') sz += 8; break
      case 'x-large': sz = 32; if (icon === 'btn') sz += 12; break
      case 'xx-large': sz = 40; if (icon === 'btn') sz += 16; break
    }
    if (icon.includes('cc:')) sz += 4
    return `${sz}px`
  }

  function getLightColor(isHovering: boolean | null) {
    if (isHovering && !toValue(isOn)) return toValue(activeColor)
    return toValue(isOn) ? toValue(activeColor) : toValue(color)
  }

  return { iconSize, getLightColor }
}
