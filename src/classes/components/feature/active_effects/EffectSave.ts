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

  public static Serialize(save: EffectSave): string | { stat: string; aoe?: boolean } {
    if (save.AoE) {
      return { stat: save.Stat, aoe: true };
    } else {
      return save.Stat;
    }
  }

  public static Deserialize(data: string | { stat: string; aoe?: boolean }): EffectSave {
    return new EffectSave(data);
  }
}

export { EffectSave };
