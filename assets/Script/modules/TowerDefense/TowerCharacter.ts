import {
    _decorator, Animation, CCBoolean, CCInteger, Collider2D, Color,
    Component,
    EventTouch, Graphics,
    instantiate, IPhysics2DContact,
    math,
    Node,
    NodeEventType,
    NodePool,
    Prefab,
    RigidBody2D, Sprite, SpriteFrame, UITransform,
    Vec2,
    Vec3
} from 'cc';
import { Behaviour } from "db://assets/Script/modules/RPG/Behaviour";
import { Bullet } from "db://assets/Script/modules/TowerDefense/Bullet";
import { Enemy } from "db://assets/Script/modules/TowerDefense/Enemy";
import { TowerLauncher } from "db://assets/Script/modules/TowerDefense/TowerLauncher";
import Character from "db://assets/Script/modules/RPG/character/Character";
import { BulletManager } from "db://assets/Script/modules/TowerDefense/BulletManager";
import { TowerConst } from "db://assets/Script/modules/TowerDefense/TowerConst";
import { TowerDataDTO } from './info/TowerDataDTO';
import { TowerConfig } from './TowerConfig';
const { ccclass, property } = _decorator;

@ccclass('TowerCharacter')
export class TowerCharacter extends Character {
    get towerData(): TowerDataDTO {
        if(!this._towerData) {
            this._towerData = new TowerDataDTO();
            this._towerData.buildCost = 100;
            this._towerData.harm = 10;
            this._towerData.speed = 300;
            this._towerData.removeBack = 90;
        }
        return this._towerData;
    }

    set towerData(value: TowerDataDTO) {
        this._towerData = value;
    }

    public lockTarget: Node = null;

    @property(Node)
    public tempLockTarget: Node = null;

    @property(Prefab)
    public bulletPrefab: Prefab = null;

    @property(Graphics)
    public graphics: Graphics = null;
    @property(CCInteger)
    public range: number = 100;
    @property({ tooltip: "控制炮塔是否需要旋转", type: CCBoolean })
    public fortIsRotate: boolean = true;

    @property({ tooltip: "炮塔等级外观资源", type: [SpriteFrame] })
    public TowerSpriteFrame: SpriteFrame[] = [];
    @property(CCBoolean)
    public isTest:boolean = false;

    private fireRate: number = 0.3;
    private timeSinceLastFire: number = 0;

    private fort: Node = null;

    private enemyList: { [key: string]: Enemy };

    private animation: Animation = null;

    private _level: number = 1;
    private _towerData: TowerDataDTO = null;

    public get level(): number {
        return this._level;
    }


    public towerId: number = 0;
    onLoad() {
        super.onLoad();
        this.fort = this.node.getChildByName("fort");
        if (this.fort) {
            this.animation = this.fort.getComponent(Animation);
        }
        // this.node.on(NodeEventType.TOUCH_START, this.onClickNode, this);
        this.enemyList = {};
    }



    private onClickNode(event: EventTouch): void {
        this.createBullet();
    }

    start() {
        if (TowerLauncher.instance && TowerLauncher.instance.isDebug) {
            this.drawRange();
        }
    }

    private drawRange(): void {
        this.graphics.clear();
        this.graphics.strokeColor = Color.RED;
        this.graphics.lineWidth = 5;
        this.graphics.circle(0, 0, this.range);
        this.graphics.stroke();
    }

    public getTarget(): Enemy {
        if (!this.enemyList) {
            return null;
        }
        const enemyKeys: string[] = Object.keys(this.enemyList);
        if (enemyKeys.length <= 0) {
            return null;
        }
        let index: number = -1;
        let minHp: number = Number.MAX_VALUE;
        for (let i = 0; i < enemyKeys.length; i++) {
            const enemy: Enemy = this.enemyList[enemyKeys[i]];
            if (enemy.hp < minHp) {
                minHp = enemy.hp;
                index = i;
            }
        }
        if (index != -1) {
            return this.enemyList[enemyKeys[index]];
        }
        return this.enemyList[enemyKeys[0]];
    }

    update(deltaTime: number) {
        if(!this.isTest && TowerLauncher.instance && (TowerLauncher.instance.gameOver || TowerLauncher.instance.pause)){
            return;
        }
        this.timeSinceLastFire += deltaTime;
        this.enemyList = {};
        let foundList: Behaviour[] = [];
        if (TowerLauncher.instance && TowerLauncher.instance.quadTree) {
            foundList = TowerLauncher.instance.quadTree.queryInRange(this.rect, this.range);
        }
        // const foundEnemyList:Enemy[] = [];
        if (foundList.length > 0) {
            for (let i = 0; i < foundList.length; i++) {
                const e = foundList[i];
                if (e instanceof Enemy) {
                    this.enemyList[e.uuid] = e;
                }
            }
        }
        const enemy: Enemy = this.getTarget();
        this.lockTarget = enemy ? enemy.node : this.tempLockTarget;

        if (this.lockTarget && this.fortIsRotate) {
            const currentPos = this.node.position.clone();
            const targetPos = this.lockTarget.position.clone();
            const radian = Math.atan2(targetPos.y - currentPos.y, targetPos.x - currentPos.x);
            const angle = radian / Math.PI * 180;
            this.fort.angle = angle //- 90

            // this.node.lookAt(this.lockTarget.worldPosition,math.v3(0,1,0));
            // this.node.eulerAngles = math.v3(0,0,this.node.eulerAngles.z)
        }


        if (this.lockTarget && this.timeSinceLastFire > this.fireRate) {
            this.timeSinceLastFire = 0;
            console.log("创建子弹了")
            this.playFireAnimation();

        }
        // this.transform.lookAtZ(targetPos);
    }

    private playFireAnimation(): void {
        if (this.animation) {
            const clips = this.animation.clips;
            const names: string[] = clips.map(clip => {
                return clip.name
            }, this)
            this.animation.on(Animation.EventType.FINISHED, this.onAnimationFinished, this)
            this.animation.play(names[Math.max(0, this.level - 1)])
        }
    }

    /**
     * 更新炮塔外观
     */
    private updateTowerOutward(): void {
        if (this.fort) {
            const fortSprinte: Sprite = this.fort.getComponent(Sprite);
            if (fortSprinte) {
                fortSprinte.spriteFrame = this.TowerSpriteFrame[Math.max(0, this.level - 1)];
            }
        }
    }

    public updateLevel(level: number): void {
        this._level = level;
        this.updateTowerOutward();
        this._towerData = TowerConfig.instance.getTowerConfig(this.towerId, this.level);
    }

    private onAnimationFinished(): void {
        this.createBullet();
    }

    private createBullet() {
        if (!this.lockTarget || (TowerLauncher.instance && (TowerLauncher.instance.gameOver || TowerLauncher.instance.pause))) {
            return;
        }
        const bullet = BulletManager.instance.create(this.bulletPrefab);
        const node: Node = bullet.node;
        // const pos = new Vec3();
        const pos = this.node.position.clone();
        const fortRadius:number = this.fort.getComponent(UITransform).width /2;
        const angle:number = this.fort.angle;
        const x:number = pos.x + fortRadius * Math.cos(angle);
        const y:number = pos.y + fortRadius * Math.sin(angle);
        node.setPosition(x,y);
        // bullet.targetNode = this.lockTarget;
        node.parent = this.node.parent;
        const direction: Vec3 = this.lockTarget.position.clone().subtract(this.node.position.clone());
        bullet.short(direction, this);

    }
}


