import { Vec3 } from "cc";
import { EntityInfo } from "../infos/EntityInfo";
import { Entity } from "./Entity";

/**
 * @fileName GameEntity.ts
 * @author zhangqiong
 * @date 2024/12/27 17:06:41"
 * @description
 */
export class GameEntity extends Entity {
    protected maxIndex: number = 1;
    protected index: number = 0;

    public isRemoveTime: boolean = false;

    public entityInfo: EntityInfo;

    protected targetMovePoint: Vec3;

    public form: GameEntity;

    constructor() {
        super();

    }

    public nextPlayerFrame(): void {

    }

    public checkNextFrame(): boolean {
        this.index++;
        if (this.index >= this.maxIndex) {
            this.index = 0;
            return true;
        }
        return false;
    }

    public canMove(): boolean {
        return true;
    }

    protected oldMoveX: number;
    protected oldMoveY: number;
    protected move(): void {
        if (this.canMove() && this.targetMovePoint) {
            this.oldMoveX = this.targetMovePoint.x;
            this.oldMoveY = this.targetMovePoint.y;
            super.move(this.targetMovePoint);
        }
    }

    public check(): void {

    }
}