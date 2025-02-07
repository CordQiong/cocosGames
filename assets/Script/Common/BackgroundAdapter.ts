import { _decorator, Component, Node, Size, UITransform, view } from 'cc';
const { ccclass, property } = _decorator;

/**
 * @fileName BackgroundAdapter.ts
 * @author zhangqiong
 * @date 2025/01/17 19:55:16"
 * @description
 */
@ccclass('BackgroundAdapter')
export class BackgroundAdapter extends Component {
    protected onLoad(): void {
        // 1. 先找到 SHOW_ALL 模式适配之后，本节点的实际宽高以及初始缩放值
        const uiTr: UITransform = this.node.getComponent(UITransform);
        const size: Size = view.getCanvasSize();
        let srcScaleForShowAll = Math.min(size.width / uiTr.width, size.height / uiTr.height);
        let realWidth = uiTr.width * srcScaleForShowAll;
        let realHeight = uiTr.height * srcScaleForShowAll;

        // 2. 基于第一步的数据，再做缩放适配
        const scale: number = Math.max(size.width / realWidth, size.height / realHeight);
        this.node.setScale(scale, scale);
    }
    start() {

    }

    update(deltaTime: number) {

    }
}
