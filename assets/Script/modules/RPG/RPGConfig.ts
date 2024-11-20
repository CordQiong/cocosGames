import { math, Vec2 } from "cc";

export interface IRPGModelData{
    index?: number;
    pos: Vec2;
    attack: number;
    def: number;
    speed: number;
    hp: number;
    camp: number;
    long: boolean;
    state?: RPGStateType;
}

export enum RPGStateType{
    Death = 0,
    Await,
    Move,
    Attack,
}

export class RPGConfig { 
    private static _inst: RPGConfig;
    public static get ins(): RPGConfig{
        if (!this._inst) {
            this._inst = new RPGConfig();
        }
        return this._inst;
    }

    public leftDatas: IRPGModelData[];
    public rightDatas: IRPGModelData[];

    public colors: string[] = [];
    public constructor() {
        this.initData();
    }

    private initData(): void{
        this.colors = [
            "#F7AEAE",
            "#9FADE4",
            "#E9E58A",
            "#B6D38B",
            "#8BD3BF",

            "#EC4727",
            "#D1B628",
            "#548B21",
            "#2EB19C",
            "#2E4DB1"
        ]
        this.leftDatas = [
            <IRPGModelData>{
                index: 0,
                attack: 30,
                def: 5,
                speed: 15,
                hp: 100,
                camp: 0,
                long: false,
                pos: math.v2(-104.869, 232),
            },
            <IRPGModelData>{
                index: 1,
                attack: 35,
                def: 10,
                speed: 20,
                hp: 100,
                camp: 0,
                long: false,
                pos: math.v2(-104.869, -37.535),
            },
            <IRPGModelData>{
                index: 2,
                attack: 40,
                def: 15,
                speed: 35,
                hp: 100,
                camp: 0,
                long: false,
                pos: math.v2(-250, 389.228),
            },
            <IRPGModelData>{
                index: 3,
                attack: 55,
                def: 10,
                speed: 40,
                hp: 100,
                camp: 0,
                long: false,
                pos: math.v2(-250, 161.407),
            },
            <IRPGModelData>{
                index: 4,
                attack: 40,
                def: 5,
                speed: 50,
                hp: 100,
                camp: 0,
                long: false,
                pos: math.v2(-250, -98.502),
            },
        ];
        this.rightDatas = [
            <IRPGModelData>{
                index: 5,
                attack: 20,
                def: 5,
                speed: 15,
                hp: 100,
                camp: 1,
                long: false,
                pos: math.v2(119.743, 232),
            },
            <IRPGModelData>{
                index: 6,
                attack: 35,
                def: 10,
                speed: 20,
                hp: 100,
                camp: 1,
                long: false,
                pos: math.v2(119.743, -37.535),
            },
            <IRPGModelData>{
                index: 7,
                attack: 40,
                def: 15,
                speed: 35,
                hp: 100,
                camp: 1,
                long: false,
                pos: math.v2(250, 389.228),
            },
            <IRPGModelData>{
                index: 8,
                attack: 45,
                def: 10,
                speed: 40,
                hp: 100,
                camp: 1,
                long: false,
                pos: math.v2(250, 161.407),
            },
            <IRPGModelData>{
                index: 9,
                attack: 50,
                def: 5,
                speed: 50,
                hp: 100,
                camp: 1,
                long: false,
                pos: math.v2(250, -98.502),
            },
        ]
    }
}