/**
 * @fileName HeroConfigVo.ts
 * @author zhangqiong
 * @date 2024/12/26 20:05:23"
 * @description
 */
export class HeroConfigVo {
    public spineId: number;
    public maxHp: number;
    public maxMp: number;
    public comp: number;
    public constructor(data: any) {
        this.spineId = data.spineId;
        this.maxHp = data.maxHp;
        this.maxMp = data.maxMp;
        this.comp = data.comp;
    }
}