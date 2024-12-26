export enum RPGModelAnimName{
    Idel = "steady",
    Attack = "attack1",
    Jump = "jump",
    Walk = "walk",
    Walk2 = "walk2"
}

export enum RPGModelDirection {
    Left = 0,
    Right = 1
}

export enum MapType{
    Angle45 = 0,
    Angle90 = 1,
}

export enum MapLoadModel{
    single = 0,
    split = 1
}

export enum PathOptimize {
    none = 0,
    better = 1,
    best = 2
}

export enum PathQuadSeek {
    path_dire_4 = 0,
    path_dire_8 = 1
}

export enum MapItemType {
    /** npc */
    Npc = "npc",
    /** 怪物 */
    Monster = "monster",
    /** 传送门 */
    Transfer = "transfer",
    /** 出生点 */
    SpawnPoint = "spawnPoint"
}