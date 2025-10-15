class EffectSave {
  public readonly Stat: 'eng' | 'sys' | 'agi' | 'hull';
  public readonly AoE: boolean;

  public constructor(data: string | { stat: string; aoe?: boolean }) {
    if (typeof data === 'string') {
      this.Stat = data.toLowerCase() as 'eng' | 'sys' | 'agi' | 'hull';
      this.AoE = false;
    } else {
      this.Stat = data.stat.toLowerCase() as 'eng' | 'sys' | 'agi' | 'hull';
      this.AoE = data.aoe || false;
    }
  }
}

export { EffectSave };
