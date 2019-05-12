import store from '@/store';
import {License} from '..'

class PilotLicense {
  private frame_id: string;
  private name: string;
  private source: string;
  private rank: number;
  private brew: string;

  constructor(frame_id: string, rank: number) {
    this.frame_id = frame_id
    const frame_data = store.getters.getItemByID('Frames', frame_id);
    this.name = frame_data.name.toUpperCase();
    this.source = frame_data.source;
    this.rank = rank;
    this.brew = frame_data.brew
  }

  public get Name(): string {
    return this.name;
  }

  public get Source(): string {
    return this.source;
  }

  public get Rank(): number {
    return this.rank;
  }

  public get Brew(): string {
    return this.brew;
  }

  public get FrameID(): string {
    return this.frame_id;
  }

  public ToString(): string {
    return `${this.source} ${this.name}, Rank ${this.rank}`
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

  public get License() {
    return new License(this.frame_id)
  }

}

export default PilotLicense