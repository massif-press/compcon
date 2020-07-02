interface ISynergyData {
  location: string
  type: string
  detail: string
}

class SynergyDecorator {
  readonly Location: string
  readonly Type: string
  readonly Detail: string

  public constructor(data: ISynergyData) {
    this.Location = data.location
    this.Type = data.type
    this.Detail = data.detail
  }

  public IsVisible(location: string, type: string): boolean {
    return (
      location.toLowerCase() === this.Location.toLowerCase() &&
      type.toLowerCase() === this.Type.toLowerCase()
    )
  }
}

export { SynergyDecorator }
