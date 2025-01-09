import { _decorator, CCInteger, Component, Node } from 'cc';
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

    protected onLoad(): void {
        FairyBirdGameManger._instance = this;
    }
    start() {

    }

    update(deltaTime: number) {

    }
}
