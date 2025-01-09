import { GameConst } from "../GameConst";
import { FightHeroInfo } from "../infos/FightHeroInfo";
import { GameEntity } from "./GameEntity";

/**
 * @fileName RoleEntity.ts
 * @author zhangqiong
 * @date 2024/12/27 19:28:02"
 * @description
 */
export class RoleEntity extends GameEntity {
    data: FightHeroInfo;

    private scaleSize: number = 0.4;

    public status: number = 0;

    public init(): void {

        super.init();
    }

    public async setData(data: FightHeroInfo): Promise<void> {
        this.data = data;
        this.setId(data.getEntityId());
        // this.setLayer(data.heroConfig.layer);
        this.setLayer(GameConst.ROLE_LAYER);
        this.setScale(this.scaleSize, this.scaleSize);
        this.setSpeed(data.heroConfig.speed);

    }


}