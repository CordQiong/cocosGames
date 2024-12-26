import { _decorator, Component, EventTouch, Label, Node, NodeEventType, Sprite, SpriteFrame } from 'cc';
import Utils from '../../Common/Utils';
import { TowerBuildInfo } from './info/TowerBuildInfo';
import { TowerCharacter } from './TowerCharacter';
import { TowerConfig } from './TowerConfig';
import { TowerLauncher } from './TowerLauncher';
const { ccclass, property } = _decorator;

@ccclass('RemoveOrUpLevel')
export class RemoveOrUpLevel extends Component {
    private upCostLabel: Label = null;
    private upCostSprite: Sprite = null;
    private removeBackLabel: Label = null;

    @property([SpriteFrame])
    public upStateSpriteFrames: SpriteFrame[] = [];

    private buildInfo: TowerBuildInfo = null;

    private isMaxLevel: boolean = false;

    private handlerCall: (handlerType: number, buildInfo: TowerBuildInfo) => void;
    private handlerObj: any;
    protected onLoad(): void {
        const upCostNode: Node = Utils.FindChildByName(this.node, "upCostLevel");
        const removeBackNode: Node = Utils.FindChildByName(this.node, "removeBackLabel");
        const upNode: Node = Utils.FindChildByName(this.node, "up");
        const removeNode: Node = Utils.FindChildByName(this.node, "remove");
        if (upNode) {
            upNode.on(NodeEventType.TOUCH_START, this.onClickUpLevel, this);
            this.upCostSprite = upNode.getComponent(Sprite);
        }
        if (removeNode) {
            removeNode.on(NodeEventType.TOUCH_START, this.onClickRemoveTower, this);
        }
        if (upCostNode) {
            this.upCostLabel = upCostNode.getComponent(Label);
        }
        if (removeBackNode) {
            this.removeBackLabel = removeBackNode.getComponent(Label);

        }
    }
    start() {

    }

    private onClickUpLevel(event: EventTouch): void {
        if (!this.buildInfo) {
            return;
        }
        if (!this.buildInfo.tower) {
            return;
        }
        if (this.isMaxLevel) {
            return;
        }
        if (this.handlerCall && this.handlerObj) {
            this.handlerCall.call(this.handlerObj, 1, this.buildInfo);
        }
    }

    private onClickRemoveTower(event: EventTouch): void {
        if (!this.buildInfo) {
            return;
        }
        if (!this.buildInfo.tower) {
            return;
        }
        if (this.handlerCall && this.handlerObj) {
            this.handlerCall.call(this.handlerObj, 2, this.buildInfo);
        }
    }

    public updateInfo(buildInfo: TowerBuildInfo, handlerCall: (handlerType: number, buildInfo: TowerBuildInfo) => void = null, callObj: any = null): void {
        this.buildInfo = buildInfo;
        this.handlerCall = handlerCall;
        this.handlerObj = callObj;
        const tower: TowerCharacter = this.buildInfo.tower;
        let spriteFrameIndex: number = 0;
        if (this.buildInfo && tower) {
            const currentLevel: number = tower.level;
            const nextLevelData = TowerConfig.instance.getTowerConfig(tower.towerId, currentLevel + 1);
            if (nextLevelData) {
                spriteFrameIndex = TowerLauncher.instance.value >= nextLevelData.buildCost ? 0 : 1;
            } else {
                spriteFrameIndex = 2;
            }
            this.upCostLabel.node.active = spriteFrameIndex != 2;
            this.isMaxLevel = spriteFrameIndex == 2;
            if (this.upCostSprite) {
                this.upCostSprite.spriteFrame = this.upStateSpriteFrames[spriteFrameIndex];
            }
            if (this.upCostLabel) {
                this.upCostLabel.string = nextLevelData ? nextLevelData.buildCost.toString() : '0';
            }
            const currentData = TowerConfig.instance.getTowerConfig(tower.towerId, currentLevel);
            if (this.removeBackLabel) {
                this.removeBackLabel.string = currentData ? currentData.removeBack.toString() : "0";
            }

            this.buildInfo.removeBackCost = currentData ? currentData.removeBack : 0;
            this.buildInfo.upLevelCost = nextLevelData ? nextLevelData.buildCost : 0;
        }
    }

    update(deltaTime: number) {

    }
}


