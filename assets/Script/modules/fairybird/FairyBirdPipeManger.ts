import { _decorator, CCInteger, Component, instantiate, math, Node, NodePool, Prefab } from 'cc';
import { FairyBirdPipe } from './FairyBirdPipe';
import { FairyBirdConst } from './FairyBirdConst';
import { FairyBirdGameManger } from './FairyBirdGameManger';
const { ccclass, property } = _decorator;

/**
 * @fileName FairyBirdPipeManger.ts
 * @author zhangqiong
 * @date 2025/01/09 16:05:46"
 * @description
 */
@ccclass('FairyBirdPipeManger')
export class FairyBirdPipeManger extends Component {

    private static _instance: FairyBirdPipeManger = null;
    public static get instance(): FairyBirdPipeManger {
        return this._instance;
    }

    @property(Prefab)
    public prafab: Prefab;

    @property(CCInteger)
    public rate: number = 2;

    private _timer: number = 0;

    private _nodePool: NodePool;
    ;

    protected onLoad(): void {
        FairyBirdPipeManger._instance = this;
    }

    start() {
        this._nodePool = new NodePool();
    }

    private cratePipe(): Node {
        const node: Node = instantiate(this.prafab);
        return node;
        if (this._nodePool.size() > 0) {
            return this._nodePool.get();
        } else {
            const node: Node = instantiate(this.prafab);
            return node;
        }
    }

    update(deltaTime: number) {
        if (FairyBirdGameManger.instance.gameState != FairyBirdConst.STATE_GAMEING) {
            return;
        }
        this._timer += deltaTime;
        if (this._timer >= this.rate) {
            this._timer = 0;
            const pipe: Node = this.cratePipe();
            this.node.addChild(pipe);
            let p = this.node.getWorldPosition()
            let y: number = math.randomRangeInt(-100, 120);
            pipe.setWorldPosition(p);
            pipe.getComponent(FairyBirdPipe).instanceCoin();
            // let p2 = this.node.getPosition();
            pipe.setPosition(0, y);

        }
    }

    public removeAllPipe(): void {
        this.scheduleOnce(() => {
            this.node.removeAllChildren();
        }, 0)
    }

    public relasePipe(node: Node): boolean {
        if (this._nodePool) {
            this._nodePool.put(node);
            return true;
        }
        return false;
    }
}
