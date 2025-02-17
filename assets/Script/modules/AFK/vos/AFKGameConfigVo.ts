import { HashMap } from "../../../Common/maps/HashMap";
import { HeroConfigVo } from "./HeroConfigVo";
import { SkillConfigVo } from "./SkillConfigVo";

/**
 * @fileName AFKGameConfigVo.ts
 * @author zhangqiong
 * @date 2024/12/26 20:17:19"
 * @description
 */
export class AFKGameConfigVo {
    public heros: { [key: string]: HeroConfigVo }
    public skills: { [key: string]: SkillConfigVo }
}