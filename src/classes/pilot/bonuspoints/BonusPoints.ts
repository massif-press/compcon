class BonusPoints{
    private _bonus_skill_points: number
    private _bonus_license_points: number
    private _bonus_talent_points: number

    public constructor(){
        this._bonus_skill_points = 0
        this._bonus_license_points = 0
        this._bonus_talent_points = 0        
    }

    public AddSkillPoint() {
        this._bonus_skill_points += 1   
    }

    public AddLicensePoint() {
        this._bonus_license_points += 1
    }

    public AddTalentPoint() {
        this._bonus_talent_points += 1
    }
}

export default BonusPoints