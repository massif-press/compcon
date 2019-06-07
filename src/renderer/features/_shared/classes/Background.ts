import store from '@/store'

interface IBackgroundData {
  id: string
  name: string
  description: string
  triggers: string
}

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

  public static Serialize(bg?: Background): string {
    return bg ? bg.id : ''
  }

  public static Deserialize(id?: string): Background {
    if (!id) return new Background()
    return store.getters.getItemById('Backgrounds', id)
  }
}

export default Background
