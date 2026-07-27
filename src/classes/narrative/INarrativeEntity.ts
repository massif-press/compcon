interface INarrativeEntity {
  readonly ID: string;
  Name: string;
  Description: string;
  Note: string;
  readonly Portrait: string;
  NarrativeController: any;
  SaveController: { IsRemote: boolean; IsCollectionItem: boolean; IsDeleted: boolean };

  RenewID(): void;

  Alias?: string;
  Title?: string;
  Pronouns?: string;
  FactionType?: string;
  TypeSuggestions?: string[];
}

export type { INarrativeEntity };
