import { License } from '@/class'

class PilotLicense {
  public readonly License: License
  private rank: number

  public constructor(license: License, rank: number) {
    this.License = license
    this.rank = rank
  }

  public get Rank(): number {
    return this.rank
  }

  public ToString(): string {
    return `${this.License.Source} ${this.License.Name}, Rank ${this.rank}`
  }

  public Increment(): boolean {
    if (this.rank < 3) {
      this.rank += 1
      return true
    }
    return false
  }

  public Decrement(): boolean {
    if (this.rank > 1) {
      this.rank -= 1
      return true
    }
    return false
  }

  public static Serialize(item: PilotLicense): IRankedData {
    return { id: item.License.FrameID, rank: item.Rank }
  }

  public static Deserialize(itemData: IRankedData): PilotLicense {
    return new PilotLicense(License.Deserialize(itemData.id), itemData.rank)
  }
}

export default PilotLicense
