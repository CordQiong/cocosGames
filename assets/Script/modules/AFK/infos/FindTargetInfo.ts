import { FightRoleEntity } from "../fight/FightRoleEntity";

/**
 * @fileName FindTargetInfo.ts
 * @author zhangqiong
 * @date 2024/12/30 19:19:22"
 * @description
 */
export class FindTargetInfo {
    enemys: FightRoleEntity[] = [];
    form: FightRoleEntity = null;
    isPaiChu: boolean = false;
    isPaiChuNotSelect: number = 0;
    type: number;
    num: number = 1;
    skillType: number = 0;
    job: number = 0;
    maxMp: number = 0;
    guild: number = 0;
}