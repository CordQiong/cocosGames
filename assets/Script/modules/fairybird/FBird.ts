import { _decorator, Collider2D, Component, Input, input, IPhysics2DContact, math, Node, RigidBody2D } from 'cc';
import { Behaviour } from '../RPG/Behaviour';
import { FairyBirdConst } from './FairyBirdConst';
import { FairyBirdGameManger } from './FairyBirdGameManger';
import { FCoin } from './FCoin';
const { ccclass, property } = _decorator;

/**
 * @fileName FBird.ts
 * @author zhangqiong
 * @date 2025/01/09 20:15:26"
 * @description
 */
@ccclass('FBird')
export class FBird extends Behaviour {
    private rig2d: RigidBody2D;

    private rotateSpeed: number = 30;
    onLoad(): void {
        super.onLoad();
        this.rig2d = this.getComponent(RigidBody2D);
    }
    start() {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
    }

    onDestroy(): void {
        super.onDestroy();
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);

    }

    onTouchStart(): void {
        this.rig2d.linearVelocity = math.v2(0, 10)
        this.node.angle = 30;
    }

    update(deltaTime: number) {
        if (FairyBirdGameManger.instance.gameState != FairyBirdConst.STATE_GAMEING) {
            this.rig2d.enabled = false;
            return;
        }
        this.rig2d.enabled = true;
        this.node.angle -= this.rotateSpeed * deltaTime;
        if (this.node.angle < -60) {
            this.node.angle = -60;
        }
    }

    protected onCollisionEnter2D(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null): void {
        if (otherCollider.tag == FairyBirdConst.TAG_LAND) {
            console.log("游戏结束");
            FairyBirdGameManger.instance.transformGameState(FairyBirdConst.STATE_GAMEOVER);
        } else if (otherCollider.tag == FairyBirdConst.TAG_PIPE) {
            console.log("游戏结束");
            FairyBirdGameManger.instance.transformGameState(FairyBirdConst.STATE_GAMEOVER);
        } else if (otherCollider.tag == FairyBirdConst.TAG_COIN) {
            const fcoin: FCoin = otherCollider.node.getComponent(FCoin);
            if (fcoin) {
                if (fcoin.type == 0) {
                    console.log("吃到金币了");
                    FairyBirdGameManger.instance.gold += 10;
                } else if (fcoin.type == 1) {
                    console.log("吃到银币了");
                    FairyBirdGameManger.instance.silver += 5;
                }
            }
            this.scheduleOnce(() => {
                otherCollider.node.removeFromParent();
                console.log("吃到金币了");
            }, 0)

        }
    }
}
