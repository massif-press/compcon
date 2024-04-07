import _ from 'lodash';

interface IMapData {
  type: 'Square' | 'HexV' | 'HexH';
  x: number;
  y: number;
  tiles: MapTile[];
}

type MapTile = {
  x: number;
  y: number;
  Flags: number;
};

class EncounterMap {
  // tile type bitmask
  DEPLOYMENT = 1 << 0;
  INGRESS = 1 << 1;
  EGRESS = 1 << 2;
  OBJECTIVE = 1 << 3;
  OBSTRUCTION = 1 << 4;
  DIFFICULT_TERRAIN = 1 << 5;
  DANGEROUS_TERRAIN = 1 << 6;
  SOFT_COVER = 1 << 7;
  HARD_COVER = 1 << 8;
  PLAYER = 1 << 9;
  ENEMY = 1 << 10;

  public MapType: 'Square' | 'HexV' | 'HexH';
  public Tiles: MapTile[] = [];
  public SizeX = 0;
  public SizeY = 0;

  // collectors for quick tile checking
  private _contX: number[] = [];
  private _contY: number[] = [];

  public constructor(data: IMapData) {
    this.MapType = data.type;
    this.SizeX = data.x;
    this.SizeY = data.y;
    this.Tiles = data.tiles;
    this._contY = _.uniq(this.Tiles.map((t) => t.y));
    this._contX = _.uniq(this.Tiles.map((t) => t.x));
  }

  public SetTile(x: number, y: number, flags: string[]) {
    if (x < 0 || y < 0) return;
    if (x >= this.SizeX || y >= this.SizeY) return;

    const t = this.Tiles.find((t) => t.x === x && t.y === y);
    if (t) t.Flags = this.getBitmask(flags);
    else this.AddTile(x, y, flags);
  }

  public AddTile(x: number, y: number, flags: string[]) {
    this._contX.push(x);
    this._contY.push(y);

    this.Tiles.push({ x, y, Flags: this.getBitmask(flags) });
  }

  public HasTile(x: number, y: number): boolean {
    if (x < 0 || y < 0) return false;
    if (x > this.SizeX || y > this.SizeY) return false;
    if (!this._contY.includes(y) && !this._contX.includes(x)) return false;
    return this.Tiles.some((t) => t.x === x && t.y === y);
  }

  public GetTile(x: number, y: number): MapTile | undefined {
    return this.Tiles.find((t) => t.x === x && t.y === y);
  }

  public ClearTile(x: number, y: number) {
    this._contX = this._contX.filter((c) => c !== x);
    this._contY = this._contY.filter((c) => c !== y);

    this.Tiles = this.Tiles.filter((t) => t.x !== x || t.y !== y);
  }

  public ClearAllTiles() {
    this._contX = [];
    this._contY = [];
    this.Tiles = [];
  }

  private getBitmask(flags: string[]): number {
    let mask = 0;
    flags.forEach((flag) => {
      const f = flag.toLowerCase().trim();
      if (f === 'deployment') mask |= this.DEPLOYMENT;
      else if (f === 'ingress') mask |= this.INGRESS;
      else if (f === 'egress') mask |= this.EGRESS;
      else if (f === 'objective') mask |= this.OBJECTIVE;
      else if (f === 'obstruction') mask |= this.OBSTRUCTION;
      else if (f === 'player') mask |= this.PLAYER;
      else if (f === 'enemy') mask |= this.ENEMY;
    });

    return mask;
  }

  public FromBitmask(mask: number): string[] {
    const flags = [] as string[];

    if ((mask & this.DEPLOYMENT) === this.DEPLOYMENT) flags.push('Deployment');
    if ((mask & this.INGRESS) === this.INGRESS) flags.push('Ingress');
    if ((mask & this.EGRESS) === this.EGRESS) flags.push('Egress');
    if ((mask & this.OBJECTIVE) === this.OBJECTIVE) flags.push('Objective');
    if ((mask & this.OBSTRUCTION) === this.OBSTRUCTION) flags.push('Obstruction');
    if ((mask & this.DIFFICULT_TERRAIN) === this.DIFFICULT_TERRAIN) flags.push('Difficult Terrain');
    if ((mask & this.DANGEROUS_TERRAIN) === this.DANGEROUS_TERRAIN) flags.push('Dangerous Terrain');
    if ((mask & this.SOFT_COVER) === this.SOFT_COVER) flags.push('Soft Cover');
    if ((mask & this.HARD_COVER) === this.HARD_COVER) flags.push('Hard Cover');
    if ((mask & this.PLAYER) === this.PLAYER) flags.push('Player');
    if ((mask & this.ENEMY) === this.ENEMY) flags.push('Enemy');

    return flags;
  }

  public Clear() {
    this.Tiles = [];
  }

  public static Serialize(map: EncounterMap): IMapData {
    return {
      type: map.MapType,
      x: map.SizeX,
      y: map.SizeY,
      tiles: map.Tiles,
    };
  }

  public static Deserialize(data: IMapData): EncounterMap {
    return new EncounterMap(data);
  }
}

export { EncounterMap };
export type { IMapData };
