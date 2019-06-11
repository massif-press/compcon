import store from '@/store'

class Background {
  private id: string
  private name: string
  private description: string
  private triggers: string

  constructor(backgroundData?: IBackgroundData) {
    if (backgroundData) {
      this.id = backgroundData.id
      this.name = backgroundData.name
      this.description = backgroundData.description
      this.triggers = backgroundData.triggers
    } else {
      this.id = this.description = this.triggers = this.name = ''
    }
  }

  public get ID(): string {
    return this.id
  }

  public get Name(): string {
    return this.name
  }

  public get Description(): string {
    return this.description
  }

  public get Triggers(): string {
    return this.triggers
  }

  public static Serialize(bg: Background): IBackgroundData | string {
    const core = store.getters.getItemById('Backgrounds', bg.ID)
    if (core && !core.err) return bg.ID
    return {
      id: bg.id,
      name: bg.name,
      description: bg.description,
      triggers: bg.triggers,
    }
  }

  public static Deserialize(bgData?: IBackgroundData | string): Background {
    if (typeof bgData === 'string')
      return store.getters.getItemById('Backgrounds', bgData)
    if (typeof bgData === 'object') return new Background(bgData)
    return new Background()
  }
}

export default Background
