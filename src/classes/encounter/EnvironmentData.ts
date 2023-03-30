import { CompendiumStore } from '@/stores';

interface IEnvironmentData {
  image: string;
  environmentType: string;
  environmentRules: string;
  description: string;
  notes: string;
}

class EnvironmentData {
  public Image: string;
  public EnvironmentType: string;
  public EnvironmentRules: string;
  public Description: string;
  public Notes: string;

  public constructor(data?: IEnvironmentData) {
    this.Image = data.image || '';
    this.EnvironmentType = data.environmentType || 'Normal';
    this.EnvironmentRules = data.environmentRules || '';
    this.Description = data.description || '';
    this.Notes = data.notes || '';
  }

  public SetEnvironment(id: string) {
    const e = CompendiumStore().referenceByID(
      'Environments',
      id
    ) as Environment;
    this.EnvironmentType = e.name;
    this.EnvironmentRules = e.description;
  }

  public static Serialize(env: EnvironmentData): IEnvironmentData {
    return {
      image: env.Image,
      environmentType: env.EnvironmentType,
      environmentRules: env.EnvironmentRules,
      description: env.Description,
      notes: env.Notes,
    };
  }

  public static Deserialize(data: IEnvironmentData): EnvironmentData {
    return new EnvironmentData(data);
  }
}

export { IEnvironmentData, EnvironmentData };
