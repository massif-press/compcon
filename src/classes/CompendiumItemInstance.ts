import { CompendiumItem } from './CompendiumItem';

type CompendiumItemInstanceData = {
  sourceData: any;
  sourceId: string;
};

class CompendiumItemInstance {
  public SourceData: any;
  public SourceId: string;

  constructor(feature: CompendiumItem) {
    this.SourceData = feature.ItemData;
    this.SourceId = feature.ID;
  }

  public static Serialize(feature: CompendiumItemInstance): CompendiumItemInstanceData {
    return {
      sourceData: feature.SourceData,
      sourceId: feature.SourceId,
    };
  }

  public Serialize(): CompendiumItemInstanceData {
    return CompendiumItemInstance.Serialize(this);
  }
}

export { CompendiumItemInstance };
export type { CompendiumItemInstanceData };
