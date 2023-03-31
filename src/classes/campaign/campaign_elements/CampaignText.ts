import { v4 as uuid } from 'uuid';

interface ICampaignTextData {
  id?: string;
  alert?: boolean;
  content?: string;
  title?: string;
}

class CampaignText {
  public ID: string;
  public Alert: boolean;
  public Content: string;
  public Title: string;
  public ItemType: string = 'CampaignText';

  constructor(data: ICampaignTextData) {
    this.ID = data.id || uuid();
    this.Alert = data.alert || false;
    this.Content = data.content || '';
    this.Title = data.title || 'New Text';
  }

  public static Serialize(t: CampaignText): ICampaignTextData {
    return {
      id: t.ID,
      title: t.Title,
      alert: t.Alert,
      content: t.Content,
    };
  }

  public static Deserialize(data: ICampaignTextData): CampaignText {
    return new CampaignText(data);
  }
}

export { CampaignText };
export type { ICampaignTextData };
