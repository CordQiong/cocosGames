import { _decorator, Button, Component, Node, sp } from 'cc';
import BaseView from '../../../ui/BaseView';
import { registerView } from '../../../ui/ViewRegisterMgr';
import { PanelType } from '../../../ui/PanelEnum';
import { LayerType } from '../../../ui/LayerManager';
import ViewConst from '../../../ui/ViewConst';
import Utils from '../../../Common/Utils';
import { viewManager } from '../../../ui/ViewManager';
import { ViewShowTypes } from '../../../Common/Enum';
import { FightMgr } from '../fight/FightMgr';
const { ccclass, property } = _decorator;

/**
 * @fileName AFKResultPanel.ts
 * @author zhangqiong
 * @date 2025/01/07 15:10:00"
 * @description
 */
@ccclass('AFKResultPanel')
export class AFKResultPanel extends BaseView {
    public showType: ViewShowTypes = ViewShowTypes.ViewAddition;
    private btn: Button;
    private spine: sp.Skeleton;
    public init(...args: any): void {
        this.btn = Utils.FindChildByName(this.node, "tryBtn").getComponent(Button);
        this.spine = Utils.FindChildByName(this.node, "spineNode").getComponent(sp.Skeleton);
        if (this.btn) {
            this.btn.node.on(Button.EventType.CLICK, this.onClickBtn, this);
        }
    }

    private onClickBtn(): void {
        viewManager.close(this);
        FightMgr.instance.reset();
        viewManager.open(PanelType.AFKGame);
    }

    public onOpen(fromUI: number | string, ...args: any): void {
        const isWin: boolean = args[0];
        let actionName: string = isWin ? "animation_2" : "animation_3";
        if (this.spine) {
            this.spine.animation = actionName;
        }
    }
    onLoad(): void {

    }
    start() {

    }

    update(deltaTime: number) {

    }
}

registerView({ viewCls: AFKResultPanel, id: PanelType.AFKResultPanel, layer: LayerType.view, prefabPathPrefix: ViewConst.defaultPrefabPathPrefix + "afk/" })
