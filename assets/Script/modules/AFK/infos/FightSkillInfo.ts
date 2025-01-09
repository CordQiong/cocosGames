import { SkillConfigVo } from "../vos/SkillConfigVo";

/**
 * @fileName FightSkillInfo.ts
 * @author zhangqiong
 * @date 2024/12/31 15:36:47"
 * @description
 */
export class FightSkillInfo {
    public skillId: number;
    public cfg: SkillConfigVo;
    /**位置0普攻，1主动，2,3,4其他槽位 */
    skillSort: number;

    public setData(config: SkillConfigVo): void {
        this.cfg = config;
        this.skillId = config.skillId;
    }

    public checkAiToCtrAngerSkill(): boolean {
        return true;
    }
}