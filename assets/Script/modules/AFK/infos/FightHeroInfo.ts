import { SkinInfo } from "cc";
import { FightConfig } from "../fight/FightConfig";
import { HeroConfigVo } from "../vos/HeroConfigVo";
import { SkillConfigVo } from "../vos/SkillConfigVo";
import { EntityInfo } from "./EntityInfo";
import { FightSkillGroupInfo } from "./FightSkillGroupInfo";
import { FightSkillInfo } from "./FightSkillInfo";
import { FightMgr } from "../fight/FightMgr";

/**
 * @fileName FightHeroInfo.ts
 * @author zhangqiong
 * @date 2024/12/26 19:43:10"
 * @description
 */
export class FightHeroInfo extends EntityInfo {

    public playerId: number = 0;

    public spineId: number = 0;

    public camp: number = 0;
    public site: number = 0;

    public hp: number = 0;
    public normalMaxHp: number = 0;
    private _maxHp: number = 0;

    mp: number = 0;
    maxMp: number = 1000;


    shield: number = 0;
    shieldMax: number = 0;

    public heroConfig: HeroConfigVo;

    public fightSkills: FightSkillGroupInfo;

    public setData(playerId: number, data: HeroConfigVo, type: number = 1): void {
        this.playerId = playerId;
        this.heroConfig = data;
        this.normalMaxHp = data.maxHp;
        this.hp = data.maxHp;
        this.maxMp = data.maxMp;
        this.camp = data.comp;
        this.site = data.site;
        this.setEntityId(playerId, type, data.spineId)
        this.spineId = data.spineId;
        this.fightSkills = new FightSkillGroupInfo();
        const skillIds: number[] = data.skillIds;
        const skillInfos: FightSkillInfo[] = [];
        for (let i = 0; i < skillIds.length; i++) {
            const id: number = skillIds[i];
            const skillConfigVo: SkillConfigVo = FightConfig.instance.getSkillConfig(id);
            const skillInfo: FightSkillInfo = new FightSkillInfo();
            skillInfo.setData(skillConfigVo);
            skillInfos.push(skillInfo);
        }
        this.fightSkills.add(skillInfos);

    }


    /***上限的血条 */
    public set maxHp(hp: number) {
        this._maxHp = hp;
    }

    /**获取总血量，包括BUFF的 */
    public get maxHp(): number {
        return Math.max(this.normalMaxHp + this._maxHp, 1);
    }

    /***恢复MP */
    public addMp(mp: number): void {
        this.mp += mp;
        this.mp = Math.max(Math.min(this.mp, this.maxMp), 0);
    }

    /***使用MP */
    public useMp(): void {
        if (!FightMgr.instance.isEnd)
            this.mp = 0;
    }

}