abstract class FeatureCollector {
  private static extract<T>(collection: string, element: object): T[] {
    let out = []

    let property = collection
    // override for profiled weapons
    if (element.hasOwnProperty(`Profile${collection}`)) property = `Profile${collection}`
    if (!element.hasOwnProperty(property)) return

    element[property].forEach(candidate => {
      if (candidate.hasOwnProperty('Destroyed') && (candidate as any).Destroyed) return
      if (candidate.hasOwnProperty('IsCascading') && (candidate as any).IsCascading) return
      if (candidate.hasOwnProperty('Used') && (candidate as any).Used) return
      out.push(candidate as T)
    })
    return out
  }

  public static Collect<T>(collection: string, arr: object[]): T[] {
    return arr.flatMap(x => {
      return this.extract(collection, x)
    })
  }
}

export { FeatureCollector }
