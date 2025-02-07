import { _decorator, CCInteger, Component, Label, Node, NodeEventType, Vec3 } from 'cc';
import { FairyBirdConst } from './FairyBirdConst';
import Utils from '../../Common/Utils';
import { FairyBirdPipeManger } from './FairyBirdPipeManger';
import { viewManager } from '../../ui/ViewManager';
import { PanelType } from '../../ui/PanelEnum';
const { ccclass, property } = _decorator;

/**
 * @fileName FairyBirdGameManger.ts
 * @author zhangqiong
 * @date 2025/01/09 15:59:19"
 * @description
 */
@ccclass('FairyBirdGameManger')
export class FairyBirdGameManger extends Component {

    private static _instance: FairyBirdGameManger = null;
    public static get instance(): FairyBirdGameManger {
        return this._instance;
    }

    @property(CCInteger)
    public moveSpeed: number = 200;

    @property(Node)
    public gameReadyNode: Node = null;
    @property(Node)
    public gameOverNode: Node = null;
    @property(Label)
    public goldLabel: Label = null;
    @property(Label)
    public silverLabel: Label = null;
    @property(Node)
    public bird: Node = null;

    public gameState: number = FairyBirdConst.STATE_READING;

    private _readyPosition: Vec3 = null;

    private _gold: number = 0;
    public get gold(): number {
        return this._gold;
    }
    public set gold(value: number) {
        this._gold = value;
        if (this.goldLabel) {
            this.goldLabel.string = `${value}`;
        }
    }
    private _silver: number = 0;
    public get silver(): number {
        return this._silver;
    }
    public set silver(value: number) {
        this._silver = value;
        if (this.silverLabel) {
            this.silverLabel.string = `${value}`;
        }
    }


    protected onLoad(): void {
        FairyBirdGameManger._instance = this;
        this._readyPosition = this.bird.position;
    }
    start() {

    }

    update(deltaTime: number) {

    }

    public transformGameState(state: number): void {
        this.gameReadyNode.active = state == FairyBirdConst.STATE_READING;
        this.gameOverNode.active = state == FairyBirdConst.STATE_GAMEOVER;
        this.gameState = state;
        if (state == FairyBirdConst.STATE_READING) {
            const startBtn = Utils.FindChildByName(this.gameReadyNode, "startBtn");
            if (startBtn) {
                startBtn.on(NodeEventType.TOUCH_START, this.onClickStartBtn, this);
            }
            const backBtn = Utils.FindChildByName(this.gameReadyNode, "backBtn");
            if (backBtn) {
                backBtn.on(NodeEventType.TOUCH_START, this.onClickBackBtn, this);
            }
            this.bird.setPosition(Vec3.ZERO);
        } else if (state == FairyBirdConst.STATE_GAMEOVER) {
            FairyBirdPipeManger.instance.removeAllPipe();
            const startBtn = Utils.FindChildByName(this.gameOverNode, "startBtn");
            if (startBtn) {
                startBtn.on(NodeEventType.TOUCH_START, this.onClickReStart, this);
            }
            const backBtn = Utils.FindChildByName(this.gameOverNode, "backBtn");
            if (backBtn) {
                backBtn.on(NodeEventType.TOUCH_START, this.onClickBackBtn, this);
            }
        }
    }

    private onClickBackBtn(): void {
        viewManager.open(PanelType.MainPanel)
    }

    private onClickStartBtn(): void {
        this.transformGameState(FairyBirdConst.STATE_GAMEING);
    }

    private onClickReStart(): void {
        this.transformGameState(FairyBirdConst.STATE_READING);
    }

}
