import { DamageType } from '../enums'

interface IMapData {
  hex: boolean
  tiles: string
}

class MapTile {
  public Impassible = false
  public Destructable = false
  public HP = 0
  public Armor = 0
  public HardCover = false
  public SoftCover = false
  public CoverSize = 0.5
  public Difficult = false
  public Dangerous = false
  public DamageType = DamageType.Kinetic
  public Special = false
  public Note = ''
  public Zone = ''
}

type Coordinate = {
  x: number
  y: number
}

class EncounterMap {
  public Hex = false
  public History: MapTile[][][]
  public RedoCache: MapTile[][][]
  public Tiles: MapTile[][]

  public constructor(x: number, y: number) {
    this.Tiles = this.generate(x, y)
    this.History = []
    this.RedoCache = []
  }

  private generate(x: number, y: number): MapTile[][] {
    const grid = new Array(y)
    for (let row = 0; row < grid.length; row++) {
      grid[row] = new Array(x).fill(new MapTile())
    }
    return grid
  }

  private stageUndo() {
    this.History.push(this.Tiles)
    this.RedoCache = []
  }

  public SetSize(x: number, y: number) {
    this.stageUndo()

    const yDiff = y - this.Tiles.length
    const xDiff = x - this.Tiles[0].length

    if (yDiff > 0) {
      for (let i = 0; i < yDiff; i++) {
        this.Tiles.push(new Array(x).fill(new MapTile()))
      }
    } else if (yDiff < 0) {
      this.Tiles.slice(0, yDiff)
    }

    this.Tiles.forEach(row => {
      if (row.length > x) row.slice(0, xDiff)
      else if (row.length < x) {
        for (let j = 0; j < xDiff; j++) {
          row.push(new MapTile())
        }
      }
    })
  }

  public Clear() {
    this.stageUndo()

    this.generate(this.Tiles[0].length, this.Tiles.length)
  }

  public Write(delta: MapTile, coords: Coordinate[]) {
    this.stageUndo()

    coords.forEach(c => {
      if (this.Tiles[c.x] && this.Tiles[c.x][c.y]) {
        for (const k in delta) {
          this.Tiles[c.x][c.y][k] = delta[k]
        }
      }
    })
  }

  public SetTileProperties(keys: string[], vals: any[], coords: Coordinate[]) {
    this.stageUndo()

    coords.forEach(c => {
      keys.forEach((k, i) => {
        this.setTileProp(k, vals[i], c)
      })
    })
  }

  private setTileProp(key: string, val: any, coord: Coordinate) {
    if (this.Tiles[coord.x] && this.Tiles[coord.x][coord.y]) {
      this.Tiles[coord.x][coord.y][key] = val
    }
  }

  public GetRect(start: Coordinate, end: Coordinate): Coordinate[] {
    const cSet = []
    for (let i = Math.min(start.y, end.y); i < Math.max(start.y, end.y); i++) {
      for (let j = Math.min(start.x, end.x); j < Math.max(start.x, end.x); j++) {
        cSet.push({ x: j, y: i })
      }
    }
    return cSet
  }

  public Undo() {
    this.Tiles = this.History.pop()
  }

  public Redo() {
    this.Tiles = this.RedoCache.pop()
  }

  public static Serialize(map: EncounterMap): IMapData {
    return {
      hex: map.Hex,
      tiles: JSON.stringify(map.Tiles),
    }
  }

  public static Deserialize(data: IMapData): EncounterMap {
    const m = new EncounterMap(0, 0)
    m.Hex = data.hex
    m.Tiles = JSON.parse(data.tiles)
    return m
  }
}

export { IMapData, EncounterMap }
