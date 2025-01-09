import { HashMap } from "../../../Common/maps/HashMap";
import { AFKGameConfigVo } from "../vos/AFKGameConfigVo";
import { HeroConfigVo } from "../vos/HeroConfigVo";
import { SkillConfigVo } from "../vos/SkillConfigVo";

/**
 * @fileName FightConfig.ts
 * @author zhangqiong
 * @date 2024/12/31 19:41:34"
 * @description
 */
export class FightConfig {
    private static _instance: FightConfig;
    public static get instance(): FightConfig {
        if (!this._instance) {
            this._instance = new FightConfig();
        }
        return this._instance;
    }

    private _heroMap: HashMap<number, HeroConfigVo>;
    private _skilsMap: HashMap<number, SkillConfigVo>;

    private _gameConfigObj: AFKGameConfigVo;
    constructor() {
        this._heroMap = new HashMap<number, HeroConfigVo>();
        this._skilsMap = new HashMap<number, SkillConfigVo>();
    }

    public init(config: AFKGameConfigVo): void {
        this._gameConfigObj = config;
        const heros = config.heros;
        for (const key in heros) {
            if (Object.prototype.hasOwnProperty.call(heros, key)) {
                const element: HeroConfigVo = heros[key];
                const hid: number = Number(key);
                this._heroMap.put(hid, element);
            }
        }

        const skills = config.skills;
        for (const key in skills) {
            let skillConfig: SkillConfigVo = skills[key];
            this._skilsMap.put(skillConfig.skillId, skillConfig);
        }
    }

    public getSkillConfigs(): SkillConfigVo[] {
        if (!this._skilsMap) {
            return [];
        }
        return this._skilsMap.values();
    }

    public getSkillConfig(skillId: number): SkillConfigVo {
        if (!this._skilsMap) {
            return null;
        }
        return this._skilsMap.get(skillId);
    }

    public getHeroConfigs(): HeroConfigVo[] {
        if (!this._heroMap) {
            return [];
        }
        return this._heroMap.values();
    }
    public getHeroConfig(hid: number): HeroConfigVo {
        if (!this._heroMap) {
            return null;
        }
        return this._heroMap.get(hid);
    }
}