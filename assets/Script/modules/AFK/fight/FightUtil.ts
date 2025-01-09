import { Game, math, random, randomRangeInt, Size, Vec3, view } from "cc";
import { GameEntity } from "./GameEntity";
import { GameConst } from "../GameConst";
import { FindTargetInfo } from "../infos/FindTargetInfo";
import { FightRoleEntity } from "./FightRoleEntity";
import ArrayUtils from "../../../Common/ArrayUtils";
import { FightMgr } from "./FightMgr";

/**
 * @fileName FightUtil.ts
 * @author zhangqiong
 * @date 2024/12/28 17:08:26"
 * @description
 */
export class FightUtil {

    private static _instance: FightUtil;
    public static get instance(): FightUtil {
        if (!this._instance) {
            this._instance = new FightUtil();
        }
        return this._instance;
    }

    public getTargetPointByDis(target: Vec3, form: Vec3, dis: number): Vec3 {
        const distance: number = this.distance(target, form);

        let trueDis: number = Math.floor(distance - dis);

        if (trueDis < 100) {
            return null;
        }

        let radian: number = this.radian(target, form);
        let y: number = Math.sin(radian) * trueDis;
        let x: number = Math.cos(radian) * trueDis;
        return math.v3(x, y);
    }

    public distance(p1: Vec3, p2: Vec3): number {
        let distance: number = Vec3.distance(p1, p2);
        return distance;
    }

    public radian(e1: Vec3, e2: Vec3): number {
        return Math.atan2(e1.y - e2.y, e1.x - e2.x);
    }

    public getAngleByVec(x: number, y: number, tx: number, ty: number): number {
        let angle: number = Math.atan2(ty - y, tx - x) * 180 / Math.PI;
        if (angle < 0) {
            angle += 360;
        }
        return angle;
    }

    public getScenceRandomPosition(): Vec3 {
        let size: Size = view.getVisibleSize();
        let width: number = size.width;
        let height: number = size.height;
        let halfWidth: number = width / 2;
        let halfHeight: number = height / 2;
        let x: number = randomRangeInt(-halfWidth, halfWidth);
        let y: number = randomRangeInt(-halfHeight, halfHeight);
        return math.v3(x, y);
    }

    public getDirectionByAngle(angle: number): number {
        let _dir: number = 0;
        if (angle > 67.5 && angle < 112.5) {
            _dir = GameConst.S;
        }
        else if (angle > 22.5 && angle <= 67.5) {
            _dir = GameConst.ES;
        }
        else if (angle < 22.5 || angle > (360 - 22.5)) {
            _dir = GameConst.E;
        }
        else if (angle > (360 - 67.5) && angle <= (360 - 22.5)) {
            _dir = GameConst.NE;
        }
        else if (angle > (270 - 22.5) && angle <= (360 - 67.5)) {
            _dir = GameConst.N;
        }
        else if (angle > (270 - 67.5) && angle <= (270 - 22.5)) {
            _dir = GameConst.WN;
        }
        else if (angle > (180 - 22.5) && angle <= (270 - 67.5)) {
            _dir = GameConst.W;
        }
        else if (angle > (180 - 67.5) && angle <= (180 - 22.5)) {
            _dir = GameConst.SW;
        }
        return _dir;
    }

    public getScaleXByDirection(direction: number): number {
        let scaleX: number = -1;
        switch (direction) {
            case GameConst.RIGHT_UP:
            case GameConst.RIGHT:
            case GameConst.RIGHT_DOWN:
                scaleX = 1;
                break;
        }
        return scaleX;
    }

    private checkSeduce(en: FightRoleEntity, type: number): number {
        return type;
    }

    public findLatelyOrFarEntity(isLately: boolean, findData: FindTargetInfo): FightRoleEntity[] {
        let en: FightRoleEntity = findData.form
        let ens: FightRoleEntity[] = findData.enemys
        let type: number = findData.type || 1;
        let num: number = findData.num == undefined ? 1 : findData.num;
        let isPaiChu: boolean = findData.isPaiChu
        // let summon: number = findData.summon

        let oldType: number = type;
        type = this.checkSeduce(en, type)
        let rr: FightRoleEntity[] = [];
        for (let i: number = 0; i < ens.length; i++) {
            if (findData.isPaiChuNotSelect == 1 || ens[i].canSelect()) {
                if (!isPaiChu || (ens[i] != en)) {
                    if (type == 3 || (type == 2 && ens[i].data.camp == en.data.camp) || (type == 1 && ens[i].data.camp != en.data.camp)) {
                        const tarPos: Vec3 = ens[i].getLocation();
                        let enPos: Vec3 = en.getLocation();
                        let dis: number = this.distance(tarPos, enPos);
                        ens[i]["findLatelyEntity_dis"] = dis;
                        rr.push(ens[i])
                    }
                }
            }
        }

        if (oldType != type) {
            //打敌方变成打自己友的情况，就要排除自己
            ArrayUtils.removeItem(rr, en)
        }
        ArrayUtils.sortBy2(rr, "findLatelyEntity_dis", isLately, false)
        return rr.slice(0, num);
    }

    /**
     * 选择随机目标
     * @param isRepeat 是否可以重复
     * @param findData 
     * @returns 
     */
    public findRandomEntity(isRepeat: boolean, findData: FindTargetInfo): FightRoleEntity[] {
        let en: FightRoleEntity = findData.form
        let ens: FightRoleEntity[] = findData.enemys
        let type: number = findData.type || 1
        let num: number = findData.num == undefined ? 1 : findData.num;
        let isPaiChu: boolean = findData.isPaiChu;

        var oldType: number = type;
        type = this.checkSeduce(en, type)
        var rr: FightRoleEntity[] = [];


        for (var i: number = 0; i < ens.length; i++) {
            if (findData.isPaiChuNotSelect == 1 || ens[i].canSelect()) {
                if (!isPaiChu || (ens[i] != en)) {
                    if (type == 3 || (type == 2 && ens[i].data.camp == en.data.camp) || (type == 1 && ens[i].data.camp != en.data.camp)) {
                        rr.push(ens[i])
                    }
                }
            }
        }
        var dd: FightRoleEntity[] = [];
        if (rr.length > 0) {
            if (!isRepeat) {
                rr = FightMgr.instance.randomArray(rr);
                dd = rr.slice(0, num);
            }
            else {
                while (num > dd.length) {
                    var index: number = FightMgr.instance.randomInt(0, rr.length - 1);
                    dd.push(rr[index]);
                }
            }
        }

        if (oldType != type) {
            //打敌方变成打自己友的情况，就要排除自己
            ArrayUtils.removeItem(dd, en)
        }
        return dd;
    }


    /**
     * 选择生命低或高
     * @param isLow 是否低
     * @param findData 
     * @param isPercent 是否百分比
     * @returns 
     */
    public findLowHpEntity(isLow: boolean, findData: FindTargetInfo, isPercent: boolean = true): FightRoleEntity[] {
        let en: FightRoleEntity = findData.form
        let ens: FightRoleEntity[] = findData.enemys;
        let type: number = findData.type || 1
        let num: number = findData.num == undefined ? 1 : findData.num;
        let isPaiChu: boolean = findData.isPaiChu
        // let summon: number = findData.summon

        var oldType: number = type;
        type = this.checkSeduce(en, type)
        var rr: FightRoleEntity[] = [];
        for (var i: number = 0; i < ens.length; i++) {
            if (findData.isPaiChuNotSelect == 1 || ens[i].canSelect()) {
                if (!isPaiChu || (ens[i] != en)) {
                    if (type == 3 || (type == 2 && ens[i].data.camp == en.data.camp) || (type == 1 && ens[i].data.camp != en.data.camp)) {
                        let value = isPercent ? (ens[i].data.hp / ens[i].data.maxHp * 10000) : ens[i].data.hp
                        ens[i]["findLatelyEntity_hp"] = value;
                        rr.push(ens[i])
                    }
                }
            }
        }

        if (oldType != type) {
            //打敌方变成打自己友的情况，就要排除自己
            ArrayUtils.removeItem(rr, en)
        }
        ArrayUtils.sortBy2(rr, "findLatelyEntity_hp", isLow, false)
        return rr.slice(0, num);
    }

    /**
     * 对称位
     * @param findData 
     * @returns 
     */
    public findDuiChenEntity(findData: FindTargetInfo): FightRoleEntity[] {
        let en: FightRoleEntity = findData.form
        let ens: FightRoleEntity[] = findData.enemys
        let type: number = findData.type || 1
        let num: number = findData.num == undefined ? 1 : findData.num;
        let isPaiChu: boolean = findData.isPaiChu
        // let summon: number = findData.summon

        type = this.checkSeduce(en, type)
        var rr: FightRoleEntity[] = [];
        for (var i: number = 0; i < ens.length; i++) {
            if (findData.isPaiChuNotSelect == 1 || ens[i].canSelect()) {
                if (!isPaiChu || ens[i] != en) {
                    if (type == 3 || (type == 2 && ens[i].data.camp == en.data.camp) || (type == 1 && ens[i].data.camp != en.data.camp)) {
                        if (ens[i].data.site == en.data.site)//同一位置
                        {
                            rr.push(ens[i])
                            break
                        }
                    }
                }
            }
        }

        //对称位置无论如任何都要排除自己（被魅惑无可能攻击自己，没被魅惑一定攻击对方）
        if (rr.length > 0)
            ArrayUtils.removeItem(rr, en)
        return rr;
    }
}