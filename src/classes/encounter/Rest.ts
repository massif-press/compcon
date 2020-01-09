export class Rest {
  private _long: boolean
  private _note: string

  public constructor(note: string, isLong: boolean) {
    this._note = note
    this._long = isLong
  }

  public get Type(): string {
    return 'Rest'
  }

  public get IsLong(): boolean {
    return this._long
  }

  public set IsLong(val: boolean) {
    this._long = val
  }

  public get Note(): string {
    return this._note
  }

  public set Note(val: string) {
    this._note = val
  }

  public static Serialize(rest: Rest): { note: string; isLong: boolean } {
    return {
      note: rest.Note,
      isLong: rest.IsLong,
    }
  }

  public static Deserialize(data: { note: string; isLong: boolean }): Rest {
    return new Rest(data.note, data.isLong)
  }
}
