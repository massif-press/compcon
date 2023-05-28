abstract class FeatureCollector {
  private static extract<T>(collection: string, element: object): T[] {
    let out = []

    let property = collection
    // override for profiled weapons
    if (element[`Profile${collection}`] !== undefined) property = `Profile${collection}`

    if (element[property] === undefined) return out

    element[property].forEach(candidate => {
      if (candidate['Destroyed'] !== undefined && (candidate as any).Destroyed) return
      if (candidate['IsCascading'] !== undefined && (candidate as any).IsCascading) return
      if (
        collection.toLowerCase() !== 'actions' &&
        candidate['Used'] !== undefined &&
        (candidate as any).Used
      )
        return
      out.push(candidate as T)
    })
    return out
  }

  public static Collect<T>(collection: string, arr: object[]): T[] {
    return arr.flatMap(x => this.extract(collection, x))
  }
}

export { FeatureCollector }
