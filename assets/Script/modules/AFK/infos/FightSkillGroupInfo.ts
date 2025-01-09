import ArrayUtils from "../../../Common/ArrayUtils";
import { Handler } from "../../../Common/Handler";
import { HashMap } from "../../../Common/maps/HashMap";
import { FightRoleEntity } from "../fight/FightRoleEntity";
import { GameConst } from "../GameConst";
import { FightSkillInfo } from "./FightSkillInfo";

/**
 * @fileName FightSkillGroupInfo.ts
 * @author zhangqiong
 * @date 2024/12/31 19:29:06"
 * @description
 */
export class FightSkillGroupInfo {
    private activeSkillIndex: number = -1;
    public skillMap: HashMap<number, FightSkillInfo>;
    public cdArray: number[] = [];
    public cdMaxArray: number[] = [];
    public cdInitMaxArray: number[] = [];
    public skillIds: number[] = [];

    constructor() {
        this.skillMap = new HashMap<number, FightSkillInfo>();
    }

    public add(skills: FightSkillInfo[]): void {
        for (let index = 0; index < skills.length; index++) {
            const skill: FightSkillInfo = skills[index];
            this.skillMap.put(skill.skillId, skill);
            this.skillIds.push(skill.skillId);
            this.cdArray.push(skill.cfg.firstCd);
            this.cdMaxArray.push(skill.cfg.cd);
            if (skill.cfg.type == GameConst.Skill_Active) {
                this.activeSkillIndex = index;
            }
        }
    }

    public getSkillBySkillId(skillId: number): FightSkillInfo {
        return this.skillMap.get(skillId);
    }

    public getSkillByIndex(index: number): FightSkillInfo {
        return this.skillMap.get(this.skillIds[index]);
    }

    public nextFrame(): void {
        for (let index = 0; index < this.cdArray.length; index++) {
            this.cdArray[index]--;
            if (this.cdArray[index] <= 0) {
                this.cdArray[index] = 0;
            }
        }
    }

    /***
         * 选择技能
         * 释放优先级：只处理自动技能，根据槽位顺序
         * skillSort 优先选择的技能位置-1是不指
         * checkFun 额外的检测方法
         *  */
    public selectSkill(entity: FightRoleEntity, skillSort: number = -1, checkFun?: Handler): FightSkillInfo {
        let sk: FightSkillInfo[] = []
        for (var i: number = 0; i < this.cdArray.length; i++) {
            if (this.cdArray[i] == 0) {
                var skInfo: FightSkillInfo = this.skillMap.get(this.skillIds[i])
                if (!checkFun || checkFun.execute(skInfo)) {
                    if (skInfo.cfg.type == GameConst.Skill_Auto) {
                        if (skInfo.cfg.skillType == 1) {
                            sk.push(skInfo);
                        }
                    }
                }
            }
        }

        if (sk.length > 0) {
            //优先位置最后的
            ArrayUtils.sortBy2(sk, "skillSort", false, false);
            let choseSkill: FightSkillInfo = sk[0]
            if (skillSort != -1) {
                //优先选择
                for (var i: number = 0; i < sk.length; i++) {
                    if (sk[i].skillSort == skillSort) {
                        choseSkill = sk[i];
                        break
                    }
                }
            }
            return choseSkill;
        }
        return null;
    }

    public checkAiToCtrAngerSkill(entity: FightRoleEntity, skillSort: number = -1): FightSkillInfo {
        var isFirst: boolean = false;
        var skInfo: FightSkillInfo = this.skillMap.get(this.skillIds[this.activeSkillIndex])
        if (skillSort != -1) {
            var tempSkillInfo: FightSkillInfo = this.skillMap.get(this.skillIds[skillSort])
            if (tempSkillInfo && !this.isSkillCD(tempSkillInfo.skillId)) {
                skInfo = tempSkillInfo;
                isFirst = true;
            }
        }

        // skInfo = this.checkChangeSkill(skInfo, entity);//检查是否有转换
        // skInfo = this.checkChangeSkillRandom(skInfo, entity);//检查是否有转换

        if (isFirst || (skInfo && skInfo.checkAiToCtrAngerSkill())) {
            return skInfo;
        }
        return null;
    }

    public isSkillCD(skillId: number): boolean {
        var index: number = this.skillIds.indexOf(skillId);
        return this.cdArray[index] > 0
    }

    public useSkill(skillId: number): void {
        let index: number = this.skillIds.indexOf(skillId);
        this.cdArray[index] = this.cdMaxArray[index];

    }

    public useAngerSkill(): FightSkillInfo {
        let skInfo: FightSkillInfo = this.skillMap.get(this.skillIds[this.activeSkillIndex])
        return skInfo;
    }

}