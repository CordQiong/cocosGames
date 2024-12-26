import { EntityInfo } from "./EntityInfo";

/**
 * @fileName FightHeroInfo.ts
 * @author zhangqiong
 * @date 2024/12/26 19:43:10"
 * @description
 */
export class FightHeroInfo extends EntityInfo {

    public playerId: number = 0;

    public camp: number = 0;
    public site: number = 0;

    public hp: number = 0;
    public normalMaxHp: number = 0;
    private _maxHp: Number = 0;

    mp: number = 0;
    maxMp: number = 1000;


    shield: number = 0;
    shieldMax: number = 0;

    public setData(playerId: number, data: any, type: number = 1): void {
        this.playerId = playerId;
    }

}