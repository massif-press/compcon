interface IBackgroundData {
    id: string
    name: string
    description: string
}

class Background {
    public readonly ID: string
    public readonly Name: string
    public readonly Description: string
    public readonly LcpName: string
    public readonly InLcp: boolean

    public constructor(data: IBackgroundData, packName?: string) {
        this.ID = data.id
        this.Name = data.name
        this.Description = data.description
        this.LcpName = packName || 'LANCER Core Book'
        this.InLcp = packName ? true : false
    }

}

export { Background, IBackgroundData }
