import { Scene } from "../Scene";
import { Unit } from "../Unit";

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

    constructor() {
        super();

    }

    public init(): void {

    }

    public changeDirByAngle(angle: number): void {

    }

    public setAction(action: string, times: number = 0, isForce: boolean = false): void {
        if (action == this.action && !isForce) {
            return;
        }
        this.action = action;
        this.changeActionAndDirection(this.action, this.direction, times, isForce);
    }

    public setDirection(direction: number, isForce: boolean = false, times: number = -1): void {
        if (direction == this.direction && !isForce) {
            return;
        }
        this.direction = direction;
        this.changeActionAndDirection(this.action, this.direction, times, isForce);
    }

    public changeActionAndDirection(action: string, direction: number = -1, times: number = -1, isForce: boolean = false): void {
        this.direction = direction;
        this.action = action;

    }
}