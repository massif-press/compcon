type AptitudeName = 'ranged' | 'melee' | 'tech' | 'control' | 'repair' | 'support';

declare type Aptitude = {
    [key in AptitudeName]?: number
}