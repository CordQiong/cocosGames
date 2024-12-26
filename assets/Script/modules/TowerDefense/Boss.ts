import { _decorator, Component, Node, ProgressBar, Vec3 } from 'cc';
import Character from "db://assets/Script/modules/RPG/character/Character";
import { EditNpcData } from "db://assets/Script/modules/RPG/EditObjData";
import { TowerLauncher } from "db://assets/Script/modules/TowerDefense/TowerLauncher";
const { ccclass, property } = _decorator;

@ccclass('Boss')
export class Boss extends Character {

    private progress: ProgressBar;
    private _currentHp: number = 10;
    private _maxHp: number = 10;
    onLoad() {
        super.onLoad();
        this.progress = this.node.getChildByName("ProgressBar").getComponent(ProgressBar);
    }

    start() {

    }

    update(deltaTime: number) {

    }

    initEditData(editData: EditNpcData) {
        this.node.position = new Vec3(editData.x, editData.y);
        this.updateHp(this._currentHp);
    }

    private updateHp(hp: number): void {
        if (this.progress) {
            this._currentHp = hp;
            this.progress.progress = this._currentHp / this._maxHp;
        }
    }

    public bleeding(): void {
        this._currentHp -= 1;
        this.updateHp(this._currentHp);
        if (this._currentHp <= 0) {
            this.scheduleOnce(() => {
                this.node.removeFromParent();
            }, 0)
            // this.destroy();
            console.error("失败了");
            TowerLauncher.instance.gameOver = true;
            TowerLauncher.instance.doGameOver();
        }
    }

    public init(): void {

    }
}


