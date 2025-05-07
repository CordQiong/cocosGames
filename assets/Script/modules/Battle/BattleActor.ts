import { Node, sp } from "cc";

export class BattleActor extends Node {
    private _skeleton: sp.Skeleton = null;
    constructor() {
        super();
        this._skeleton = this.addComponent(sp.Skeleton);
    }

    public setSkin(skin: string): void { 
        if (this._skeleton) {
            this._skeleton.setSkin(skin);
        }
    }

    public setAnimation(name: string, loop: boolean): void {
        if (this._skeleton) {
            this._skeleton.setAnimation(0, name, loop);
        }
    }

}