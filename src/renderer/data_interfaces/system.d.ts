declare interface System extends CCItem {
    type: string,
    sp: number,
    tags: TagList,
    effect: string,
    description?: string,
    data_type: "system",
    aptitude: Aptitude,
    talent_item?: true,
    talent_id?: string,
    talent_rank?: number,
    brew?: string
}