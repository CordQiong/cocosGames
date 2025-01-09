import { Game, random, randomRangeInt } from "cc";
import { Handler } from "../../../Common/Handler";
import MathUtils from "../../../Common/MathUtils";
import { FightRoleEntity } from "./FightRoleEntity";
import { FindTargetInfo } from "../infos/FindTargetInfo";
import { GameConst } from "../GameConst";
import { FightUtil } from "./FightUtil";
import { viewManager } from "../../../ui/ViewManager";
import { PanelType } from "../../../ui/PanelEnum";

/**
 * @fileName FightMgr.ts
 * @author zhangqiong
 * @date 2024/12/27 19:50:35"
 * @description
 */
export class FightMgr {
    private static _instance: FightMgr = null;
    public static get instance(): FightMgr {
        if (!this._instance) {
            this._instance = new FightMgr();
        }
        return this._instance;
    }

    public fightTime: number = 0;

    private entitys: FightRoleEntity[] = [];

    /***死亡实体顺序表 */
    private dieEntitys: FightRoleEntity[] = [];

    private fightEnd: Handler = null;

    public reset(): void {
        this.dieEntitys = [];
        this.entitys = [];
        this.fightTime = 0;
        this.isEnd = false;

    }


    public isEnd: boolean = false;

    public seed: number = 5;
    public initSeed: number = 5;

    public index: number = 0;
    public setRandomSeed(seed: number): void {
        this.initSeed = seed;
    }
    public resRandomSeed(): void {
        this.seed = this.initSeed;
    }

    public logRandomArr: number[] = [];
    public seedRandom(): number {
        if (this.logRandomArr.length < 30) {
            this.logRandomArr.push(this.seed);
        }
        this.seed == (this.seed * 9301 + 49297) % 233280;
        let r: number = this.seed / 2333280.0;
        return r;
    }

    public randomInt(min: number, max: number = 0, stpeLen: number = 1): number {
        if (min > max) {
            let temp: number = min;
            min = max;
            max = temp;
        }
        let deltaRange: number = (max - min) + (1 * stpeLen);
        let randomNum: number = this.seedRandom() * deltaRange;
        return Math.floor(randomNum / stpeLen) * stpeLen;
    }

    public isRandTrue(rate: number): boolean {
        let random: number = this.randomInt(0, 10000);
        return random <= rate;
    }

    public randomProbability(array: number[]): number {
        let sum: number = 0;
        let temp: number[] = [];
        for (let i: number = 0; i < array.length; i++) {
            sum += array[i];
            temp.push(sum);
        }
        if (sum == 0) {
            return 0;
        }
        let a: number;
        do {
            a = this.randomInt(0, sum);
        } while (a == 0);
        for (let j = 0; j < temp.length; j++) {
            if (a > temp[j]) {
                continue;
            }
            return j;
        }
    }

    public randomArray<T>(array: T[]): T[] {
        const cloneArray: T[] = array.concat();
        let leng: number = cloneArray.length;
        for (let i: number = 0; i < leng; i++) {
            let index: number = Math.floor(this.seedRandom() * cloneArray.length);
            let temp: T = cloneArray[index];
            cloneArray[index] = cloneArray[i];
            cloneArray[i] = temp;
        }
        return cloneArray;
    }

    public addEntity(entity: FightRoleEntity): void {
        entity.isRemoveTime = false;
        this.entitys.push(entity);
    }

    public removeEntity(entity: FightRoleEntity): void {
        entity.isRemoveTime = true;
    }

    public getEntitys(): FightRoleEntity[] {
        return this.entitys;
    }

    /**实体死亡 */
    public entityToDie(e: FightRoleEntity): void {
        this.addDieEntity(e);
    }

    /***增加死亡实体 */
    public addDieEntity(e: FightRoleEntity): void {
        e.isRemoveTime = true;
        if (this.dieEntitys.indexOf(e) == -1) {
            this.dieEntitys.push(e);
        }
    }

    public start(fightEnd: Handler): void {
        this.fightEnd = fightEnd;
        for (let i = 0; i < this.entitys.length; i++) {
            const element = this.entitys[i];

        }
    }

    private doActiveSkillStopHandler(): boolean {
        return this.isEnd;
    }

    public doFrameHandler(): number {
        let enemyNum: number = 0;
        let heroNum: number = 0;
        if (!this.doActiveSkillStopHandler()) {
            this.index++;

            for (let index = 0; index < this.entitys.length; index++) {
                const element = this.entitys[index];
                let isMustActiveSkill: boolean = false;
                if (!element.isRemoveTime) {
                    if (element.checkNextFrame()) {
                        element.check(isMustActiveSkill);
                    }
                    if (element.data.camp == 0) {
                        heroNum++;
                    } else {
                        enemyNum++;
                    }
                }
            }
        }

        if (enemyNum == 0 && heroNum > 0) {
            this.isEnd = true;
            for (let index = 0; index < this.entitys.length; index++) {
                const element = this.entitys[index];
                if (!element.isRemoveTime) {
                    element.setIsWin(true);
                }
            }
            console.error("赢了");
            viewManager.open(PanelType.AFKResultPanel, true);
        } else if (heroNum == 0 && enemyNum > 0) {
            this.isEnd = true;
            for (let index = 0; index < this.entitys.length; index++) {
                const element = this.entitys[index];
                if (!element.isRemoveTime) {
                    element.setIsWin(true);
                }
            }
            console.error("输了");
            viewManager.open(PanelType.AFKResultPanel, false);
        }
        return 0;
    }

    public getCanSelectEntitys(): FightRoleEntity[] {
        let results: FightRoleEntity[] = [];
        let checkEntitys: FightRoleEntity[] = this.entitys.concat();
        for (let index = 0; index < checkEntitys.length; index++) {
            const element = checkEntitys[index];
            if (element.canSelect() && !element.isRemoveTime) {
                results.push(element);
            }
        }
        return results;
    }

    public findMainEntity(from: FightRoleEntity, targetType: number, isPaichuNotSelect: number = 0): FightRoleEntity[] {
        let arr: FightRoleEntity[] = []
        let entitys: FightRoleEntity[] = this.getCanSelectEntitys();
        let findInfo: FindTargetInfo = new FindTargetInfo()
        findInfo.enemys = entitys
        findInfo.form = from
        // findInfo.summon = 1
        findInfo.type = 1
        findInfo.isPaiChuNotSelect = isPaichuNotSelect

        switch (targetType) {
            case GameConst.Main_JuLiZuiJin:
                arr = FightUtil.instance.findLatelyOrFarEntity(true, findInfo);
                break
            case GameConst.Main_JuLiZuiYuan:
                arr = FightUtil.instance.findLatelyOrFarEntity(false, findInfo);
                break
            case GameConst.Main_XueBaiFenZuiDi:
                arr = FightUtil.instance.findLowHpEntity(true, findInfo);
                break
            case GameConst.Main_XueBaiFenZuiGao:
                arr = FightUtil.instance.findLowHpEntity(false, findInfo);
                break
            case GameConst.Main_ChuShiDuiChengWeiZhi:
                arr = FightUtil.instance.findDuiChenEntity(findInfo);
                break
            case GameConst.Main_DangQianMuBiao:
                //默认选最近
                arr = FightUtil.instance.findLatelyOrFarEntity(true, findInfo);
                break
        }

        //没目标找最近
        if (arr.length == 0)
            arr = FightUtil.instance.findLatelyOrFarEntity(true, findInfo);

        return arr
    }

    public findEntity(form: FightRoleEntity, targetTypes: number[]): FightRoleEntity[] {
        let results: FightRoleEntity[] = [];
        let entitys: FightRoleEntity[] = this.getCanSelectEntitys();

        let findInfo: FindTargetInfo = new FindTargetInfo();
        findInfo.enemys = entitys;
        findInfo.form = form;
        findInfo.type = targetTypes[1];
        findInfo.num = targetTypes[2];
        const targetType: number = targetTypes[0];

        switch (targetType) {
            case GameConst.JuLiZuiJin:
                results = FightUtil.instance.findLatelyOrFarEntity(false, findInfo);
                break;
            case GameConst.JuLiZuiYuan:
                results = FightUtil.instance.findLatelyOrFarEntity(true, findInfo);
                break;
            case GameConst.SuiJiBuKeChongFu:
                results = FightUtil.instance.findRandomEntity(false, findInfo);
                break;
            case GameConst.SuiJiKeChongFu:
                results = FightUtil.instance.findRandomEntity(true, findInfo);
                break;
            case GameConst.ChuShiDuiChengWeiZhi:
                results = FightUtil.instance.findDuiChenEntity(findInfo);
                break
            case GameConst.XueZuiDi:
                results = FightUtil.instance.findLowHpEntity(true, findInfo, false);
                break
            case GameConst.XueZuiGao:
                results = FightUtil.instance.findLowHpEntity(false, findInfo, false);
                break

            default:
                break;
        }


        // let enemys: FightRoleEntity[] = [];
        // for (let i: number = 0; i < entitys.length; i++) {
        //     let entity: FightRoleEntity = entitys[i];
        //     if (form.data.camp == 0) {
        //         if (entity.data.camp == 1) {
        //             enemys.push(entity)
        //         }
        //     } else if (form.data.camp == 1) {
        //         if (entity.data.camp == 0) {
        //             enemys.push(entity);
        //         }
        //     }
        // }
        // let index: number = randomRangeInt(0, enemys.length - 1) //this.randomInt(0, enemys.length - 1);
        // results = [enemys[index]];

        return results;
    }


}