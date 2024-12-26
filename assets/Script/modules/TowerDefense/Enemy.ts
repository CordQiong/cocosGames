import { _decorator, Collider2D, EventTouch, IPhysics2DContact, Node, ProgressBar, Vec2 } from 'cc';
import { Behaviour } from '../RPG/Behaviour';
import Character from "db://assets/Script/modules/RPG/character/Character";
import { Boss } from "db://assets/Script/modules/TowerDefense/Boss";
import { TowerLauncher } from "db://assets/Script/modules/TowerDefense/TowerLauncher";
import { EffectManager } from "db://assets/Script/modules/TowerDefense/EffectManager";
import {TowerSceneMap} from "db://assets/Script/modules/TowerDefense/TowerSceneMap";
const { ccclass, property } = _decorator;

@ccclass('Enemy')
export class Enemy extends Character {



    private progress: ProgressBar;
    private _currentHp: number = 100;
    private _maxHp: number = 100;

    public price: number = 50;


    public get hp(): number {
        return this._currentHp;
    }

    start() {

    }



    public damage(value: number): void {
        this._currentHp -= value;
        this.updateHp();
        EffectManager.instance.showEffect("tower1_eff", this.node.position.clone()).then((value) => {

        }).catch((err) => {
            console.error(err);
        })
        if (this._currentHp <= 0) {
            this.die();
            TowerLauncher.instance.value += this.price;
            TowerLauncher.instance.popEnemyCount ++;
            EffectManager.instance.showEffect("EnemyDie", this.node.position.clone())
        }
    }

    public die(): void {
        this._currentHp = 0;
        this.scheduleOnce(() => {
            TowerLauncher.instance.removeEnemy(this);
            this.node.removeFromParent();
        }, 0)
    }

    private updateHp(): void {
        if (this.progress) {
            this.progress.progress = this._currentHp / this._maxHp;
        }
    }

    onLoad() {
        super.onLoad();
        this.progress = this.node.getChildByName("ProgressBar").getComponent(ProgressBar);
        this.updateHp();
    }

    public navigationByPath(paths: Vec2[]): void {
        if (paths.length > 0) {
            this.wolkByVec2(paths);
        }
    }

    public init(): void {

    }

    protected onTriggerEnter2D(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null): void {
        // console.log("onTriggerEnter2D");
        // const target = otherCollider.node.getComponent(Boss);
        // if(target){
        //     target.bleeding();
        //     this.node.removeFromParent();
        // }
    }

    protected onTriggerExit2D(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null): void {
        // console.log("onTriggerExit2D");
    }

    protected onCollisionEnter2D(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null): void {
        // console.log("onCollisionEnter2D");
        // const target = otherCollider.node.getComponent(Boss);
        // if(target){
        //     target.bleeding();
        //     this.die();
        // }
    }

    protected onCollisionExit2D(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null): void {
        // console.log("onCollisionExit2D");
    }



}


