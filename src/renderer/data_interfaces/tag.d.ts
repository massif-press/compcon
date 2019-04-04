declare interface Tag {
    id: string,
    name: string,
    description: string,
}

declare type TagList = {
    id: string,
    val?: number | string
}[];