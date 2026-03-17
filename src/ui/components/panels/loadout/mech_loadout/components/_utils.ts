export function manufacturerColor(mech: any, isDark: boolean): string {
  return mech.Frame.Manufacturer.GetColor(isDark)
}
