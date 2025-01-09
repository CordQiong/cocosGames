/**
 * @fileName SkillConfigVo.ts
 * @author zhangqiong
 * @date 2024/12/31 19:36:56"
 * @description
 */
export class SkillConfigVo {
    skillId: number;
    firstCd: number;
    cd: number;
    /** 1表示能量技能，2自动释放技能，3被动技能，4被动触发主动技能, 5神器技能.6圣龙技能 */
    type: number;
    /** 主目标 */
    target: number;
    /** 1普攻 2技能 */
    skillType: number;

    //选择目标类型 0：选择类型 1: 选择阵营类型 1 不同阵营 2 同阵营 3 全部
    targetTypes: number[];
    /** 施法距离 */
    distance: number;
    /** 技能伤害 */
    hurt: number;
    /** 恢复的能量 */
    recoveyAnger: number;


}