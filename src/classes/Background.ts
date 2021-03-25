interface IBackgroundData {
    id: string
    name: string
    description: string
}

class Background {
    public readonly ID: string
    public readonly Name: string
    public readonly Description: string

    public constructor(data: IBackgroundData) {
        this.ID = data.id
        this.Name = data.name
        this.Description = data.description
    }

}

export { Background, IBackgroundData }
