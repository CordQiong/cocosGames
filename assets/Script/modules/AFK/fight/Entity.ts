import { sp, Vec3 } from "cc";
import { Scene } from "../Scene";
import { Unit } from "../Unit";
import { GameConst } from "../GameConst";
import { SpineSkeleton } from "../../../Common/SpineSkeleton";
import { FightUtil } from "./FightUtil";
import { Handler } from "../../../Common/Handler";
import { ActionInfo } from "../infos/ActionInfo";

/**
 * @fileName Entity.ts
 * @author zhangqiong
 * @date 2024/12/24 15:49:24"
 * @description
 */
export class Entity extends Unit {
    public mScene: Scene;

    speed: number = 12;

    url: string;
    role: any; // todo
    direction: number = 0;
    action: string;
    dirMode: number;

    private roleSpine: SpineSkeleton;

    constructor() {
        super();

    }

    public init(): void {

    }

    public get x(): number {
        let pos: Vec3 = this.getLocation();
        return pos ? pos.x : 0;
    }

    public get y(): number {
        let pos: Vec3 = this.getLocation();
        return pos ? pos.y : 0;
    }

    public changeDirByAngle(angle: number): void {
        this.setDirection(FightUtil.instance.getDirectionByAngle(angle));
    }

    public setRole(id: number): Promise<void> {
        if (!this.roleSpine) {
            this.roleSpine = this.getComponent(SpineSkeleton);
            if (!this.roleSpine) {
                this.roleSpine = this.addComponent(SpineSkeleton);
            }
        }
        return this.roleSpine.setSpineId(id)
    }

    public stopAction(): void {
        this.setAction(GameConst.Idle);
    }

    public setAction(action: string, times: number = -1, handler: Handler = null, oper: number = GameConst.Action_Opre_One, isForce: boolean = false): Promise<void> {
        if (action == this.action && !isForce) {
            return;
        }
        this.action = action;
        this.action = action;
        const info: ActionInfo = new ActionInfo(action, handler, times);
        return this.roleSpine.setAnimation(info);
    }

    public getCurrentAction(): string {
        if (this.roleSpine) {
            return this.roleSpine.currentAnimation;
        }
        return this.action;
    }


    public setSpineKeyFrameHandler(handler: Handler): void {
        if (this.roleSpine) {
            this.roleSpine.keyFrameHandler = handler;
        }
    }

    public setDirection(direction: number, isForce: boolean = false, times: number = -1): void {
        if (direction == this.direction && !isForce) {
            return;
        }
        this.direction = direction;
        const scale: Vec3 = new Vec3();
        this.getScale(scale);

        let realyscaleX: number = FightUtil.instance.getScaleXByDirection(direction);

        let scaleX: number = Math.abs(scale.x) * realyscaleX;
        this.setScale(scaleX, scale.y);
    }

    public changeActionAndDirection(action: string, direction: number = -1, times: number = -1, handler: Handler = null, isForce: boolean = false): void {
        this.setDirection(direction, isForce);
        this.setAction(action, times, handler);

    }

    public setSpeed(speed: number): void {
        this.speed = Math.floor(speed);
        this.oldAngle = -1;

    }

    private dx: number;
    private dy: number;
    private dist: number;
    protected moveAngle: number;
    protected oldAngle: number = -1
    protected oldMoveAngle: number = -1;

    protected xSpeed: number = 0;
    protected ySpeed: number = 0;

    public getSize(): number {
        return 50;
    }
    protected move(targetMovePoint: Vec3): void {
        this.setAction(GameConst.Move);
        const pos: Vec3 = this.getLocation();
        this.dx = targetMovePoint.x - pos.x;
        this.dy = targetMovePoint.y - pos.y;
        this.dist = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
        if (this.dist < this.speed) {
            this.onMoveEnd(targetMovePoint);
            return;
        }
        this.toMove(this.moveAngle, -1);
    }

    private onMoveEnd(targetMovePoint: Vec3): void {
        this.oldAngle = -1;
        this.setLocation(targetMovePoint.x, targetMovePoint.y);
        this.setAction(GameConst.Idle);

    }

    private setSpeedXY(angle: number, endSpeed: number = -1, tickIndex: number): void {
        if (endSpeed == -1) {
            this.xSpeed = this.speed * Math.cos(angle * Math.PI / 180) * tickIndex;
            this.ySpeed = this.speed * Math.sin(angle * Math.PI / 180) * tickIndex;
        } else {
            this.xSpeed = endSpeed * Math.cos(angle * Math.PI / 180);
            this.ySpeed = endSpeed * Math.sin(angle * Math.PI / 180);
        }
    }

    private toMove(angle: number, endSpeed: number = -1): void {
        if (this.oldAngle != angle) {
            this.setSpeedXY(angle, endSpeed, 1);
        }
        this.oldAngle = angle;
        const pos: Vec3 = this.getLocation();
        const newX: number = pos.x + this.xSpeed;
        const newY: number = pos.y + this.ySpeed;
        this.setLocation(newX, newY);
        this.updateHeadPos();
    }

    public updateHeadPos(): void {

    }
}