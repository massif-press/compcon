import { EncounterInstance } from '@/classes/encounter/EncounterInstance';
import { CombatController } from './CombatController';

class expiration {
  public Period: 'round' | 'turn' | 'encounter' = 'encounter';
  public EndsOn: 'start' | 'end' = 'end';

  // this is the actor that references the self/target whose turn it is for turn-based expirations
  public ExpirationActorID: string | null = null;
  public ExpirationActorTurn: number | null = null;

  // for round-only expirations
  public RoundEndNumber: number | null = null;
  public Raw: string;
  public Text: string = '';

  constructor(
    expiration: string,
    source?: CombatController,
    target?: CombatController,
    encounter?: EncounterInstance,
  ) {
    console.log(expiration);
    const str = expiration?.toLowerCase() || '';
    this.Raw = expiration || '';
    let text = '';

    if (str.includes('round')) this.Period = 'round';
    else if (str.includes('turn')) this.Period = 'turn';

    if (str.includes('start')) this.EndsOn = 'start';

    if (target && this.Period === 'turn') {
      if (str.includes('target')) {
        this.ExpirationActorID = target.Parent.ID;
        this.ExpirationActorTurn = target.Turn;
        text = `Ends at the ${this.EndsOn} of your (${target.CombatName}) turn`;
      } else if (source) {
        this.ExpirationActorID = source.Parent.ID;
        this.ExpirationActorTurn = source.Turn;
        text = `Ends at the ${this.EndsOn} of ${source.CombatName}'s turn`;
      }
    } else if (encounter && this.Period === 'round') {
      const currentRound = encounter.Round;
      const roundOffset = Number(str.split('_').pop() || '1');
      this.RoundEndNumber = currentRound + roundOffset;
      text = `Ends at the ${this.EndsOn} of round ${this.RoundEndNumber}`;
    }

    this.Text = text;
  }

  HasExpired(currentRound: number, currentActorID: string, currentActorTurn: number): boolean {
    if (this.Period === 'round') {
      if (this.RoundEndNumber !== null && currentRound >= this.RoundEndNumber) {
        return true;
      }
    } else if (this.Period === 'turn') {
      if (
        this.ExpirationActorID === currentActorID &&
        this.ExpirationActorTurn !== null &&
        currentActorTurn >= this.ExpirationActorTurn
      ) {
        return true;
      }
    }
    return false;
  }

  public static Serialize(exp: expiration): any {
    if (!exp) return null;
    return {
      Raw: exp.Raw,
      Period: exp.Period,
      EndsOn: exp.EndsOn,
      ExpirationActorID: exp.ExpirationActorID,
      ExpirationActorTurn: exp.ExpirationActorTurn,
      RoundEndNumber: exp.RoundEndNumber,
      Text: exp.Text,
    };
  }

  public static Deserialize(data: any): expiration {
    if (!data) return new expiration('');
    const exp = new expiration(typeof data === 'string' ? data : data.Raw || '');
    exp.Period = data.Period;
    exp.EndsOn = data.EndsOn;
    exp.ExpirationActorID = data.ExpirationActorID;
    exp.ExpirationActorTurn = data.ExpirationActorTurn;
    exp.RoundEndNumber = data.RoundEndNumber;
    exp.Text = data.Text;
    return exp;
  }
}
export { expiration };
