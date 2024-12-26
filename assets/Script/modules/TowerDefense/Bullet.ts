import {
    _decorator,
    Animation,
    CCInteger,
    Collider2D,
    Component,
    IPhysics2DContact,
    math,
    Node,
    RigidBody2D,
    Size,
    Vec2,
    Vec3, view
} from 'cc';
import Character from "db://assets/Script/modules/RPG/character/Character";
import { TowerConst } from "db://assets/Script/modules/TowerDefense/TowerConst";
import { BulletManager } from "db://assets/Script/modules/TowerDefense/BulletManager";
import { Enemy } from "db://assets/Script/modules/TowerDefense/Enemy";
import { TowerCharacter } from './TowerCharacter';
import { TowerLauncher } from './TowerLauncher';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends Character {

    @property(Node)
    public targetNode: Node;
    @property(CCInteger)
    public speed: number = 0;

    private direction2: Vec3 = Vec3.ZERO;

    private body: Node;

    public harm: number = 10;

    private targetPosition: Vec3;

    private view: Size;

    private towerLevel: number;

    private tower: TowerCharacter = null;

    private animation: Animation = null;

    onLoad() {
        super.onLoad();
        this.body = this.node.getChildByName("body");
        this.view = view.getVisibleSize();
        this.animation = this.node.getComponent(Animation);
        // if (this.targetNode) {
        //     // 计算子弹的移动方向
        //     const targetPos = this.targetNode.position;
        //     const currentPos = this.node.position;
        //     this.direction2 = math.v2(targetPos.x,targetPos.y).subtract(math.v2(currentPos.x,currentPos.y)).normalize(); //targetPos.subtract(currentPos).normalize();  // 计算方向向量
        // }
        // const rig = this.node.getComponent(RigidBody2D);
        // rig.applyForceToCenter(this.direction2.multiply(math.v2(0,this.speed)),true);
    }

    start() {

    }

    update(dt) {
        if (TowerLauncher.instance && (TowerLauncher.instance.gameOver || TowerLauncher.instance.pause)) {
            this.node.removeFromParent();
            BulletManager.instance.release(this);
            return;
        }
        if (this.direction2) {
            const radian = Math.atan2(this.direction2.y, this.direction2.x);

            const direction = this.direction2.clone().normalize();
            const angle = radian / Math.PI * 180;
            this.node.angle = angle //- 90

            const displacement = direction.multiplyScalar(this.speed * dt);
            this.node.position = this.node.position.clone().add(displacement);
        }



        // 如果子弹飞出了场景，可以设置回收
        if (Math.abs(this.node.position.x) > this.view.width || Math.abs(this.node.position.y) > this.view.height || Math.abs(this.node.position.x) < 0 || Math.abs(this.node.position.y) < 0) {
            this.node.removeFromParent();
            BulletManager.instance.release(this);
        }
    }

    public short(direction: Vec3, tower: TowerCharacter): void {
        this.direction2 = direction;
        this.tower = tower;
        if (tower) {
            this.towerLevel = tower.level;
            this.playBulletAnimation();
            this.speed = tower.towerData.speed;
            this.harm = tower.towerData.harm;
        }
        // this.speed = speed;


    }

    private playBulletAnimation(): boolean {
        if (this.animation) {
            const clips = this.animation.clips;
            const names: string[] = clips.map(clip => {
                return clip.name
            }, this)
            this.animation.on(Animation.EventType.FINISHED, this.onAnimationFinished, this)
            this.animation.play(names[Math.max(0, this.towerLevel - 1)]);
            return true;
        }
        return false;
    }

    private onAnimationFinished(): void {

    }


}


