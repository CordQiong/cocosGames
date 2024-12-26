import { _decorator, Button, Component, Node, Sprite, SpriteFrame, Texture2D } from 'cc';
import BaseView from '../../ui/BaseView';
import { registerView } from '../../ui/ViewRegisterMgr';
import { PanelType } from '../../ui/PanelEnum';
import { LayerType } from '../../ui/LayerManager';
import ViewConst from '../../ui/ViewConst';
import Utils from '../../Common/Utils';
import { viewManager } from '../../ui/ViewManager';
import AssetMgr from '../../Common/AssetMgr';
import { ViewShowTypes } from '../../Common/Enum';
import {TowerLauncher} from "db://assets/Script/modules/TowerDefense/TowerLauncher";
import {TowerSceneMap} from "db://assets/Script/modules/TowerDefense/TowerSceneMap";
import {TowerMapLayer} from "db://assets/Script/modules/TowerDefense/TowerMapLayer";
const { ccclass, property } = _decorator;

@ccclass('GameOverOrWin')
export class GameOverOrWin extends BaseView {
    private bg: Sprite;
    private tryBtn: Button;
    private nextBtn: Button;

    @property(SpriteFrame)
    winSpriteFrame: SpriteFrame = null;
    @property(SpriteFrame)
    loseSpriteFrame: SpriteFrame = null;

    public showType: ViewShowTypes = ViewShowTypes.ViewAddition;

    public async onOpen(fromUI: number | string, ...args: any) {
        const isWin: boolean = args[0]
        const lose = await AssetMgr.instance.load<Texture2D>("resources://tower/res/NormalMordel/GameOverAndWin/gameover0-hd_1/texture")
        const win = await AssetMgr.instance.load<Texture2D>("resources://tower/res/NormalMordel/GameOverAndWin/gameover0-hd_8/texture")
        if (this.bg) {
            const spriteframe: SpriteFrame = new SpriteFrame();
            spriteframe.texture = isWin ? win : lose;
            this.bg.spriteFrame = spriteframe;
        }
    }

    public init(...args: any): void {
        this.bg = Utils.FindChildByName(this.node, "bg").getComponent(Sprite);
        this.tryBtn = Utils.FindChildByName(this.node, "BtnTry").getComponent(Button);
        this.nextBtn = Utils.FindChildByName(this.node, "BtnContinue").getComponent(Button);
        if (this.tryBtn) {
            this.tryBtn.node.on(Button.EventType.CLICK, this.onClickTryAgain, this);
        }
        if (this.nextBtn) {
            this.nextBtn.node.on(Button.EventType.CLICK, this.onClickNext, this);
        }
    }

    private onClickTryAgain(): void {
        // TowerLauncher.instance.onGameStar(TowerLauncher.instance.mapId);
        TowerLauncher.instance.restart();
        TowerSceneMap.instance.setMapId(TowerLauncher.instance.mapId)
        viewManager.close();
    }

    private onClickNext(): void {
        TowerLauncher.instance.restart();
        TowerSceneMap.instance.setMapId(TowerLauncher.instance.mapId +1);
        viewManager.close();
    }
    start() {

    }

    update(deltaTime: number) {

    }
}
registerView({
    viewCls: GameOverOrWin,
    id: PanelType.GameOverOrWin,
    layer: LayerType.window,
    prefabPathPrefix: ViewConst.defaultPrefabPathPrefix + "tower/"
})

