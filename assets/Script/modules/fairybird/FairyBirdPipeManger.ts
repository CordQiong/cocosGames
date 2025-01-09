import { _decorator, CCInteger, Component, instantiate, math, Node, NodePool, Prefab } from 'cc';
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
    public rate: number = 1.5;

    private _timer: number = 0;

    private _nodePool: NodePool;

    protected onLoad(): void {
        FairyBirdPipeManger._instance = this;
    }

    start() {
        this._nodePool = new NodePool();
    }

    private cratePipe(): Node {
        if (this._nodePool.size() > 0) {
            return this._nodePool.get();
        } else {
            const node: Node = instantiate(this.prafab);
            return node;
        }
    }

    update(deltaTime: number) {
        this._timer += deltaTime;
        if (this._timer >= this.rate) {
            this._timer = 0;
            const pipe: Node = this.cratePipe();
            this.node.addChild(pipe);
            let p = this.node.getWorldPosition()
            let y: number = math.randomRangeInt(-100, 140);
            pipe.setWorldPosition(p);

            let p2 = this.node.getPosition();
            pipe.setPosition(p2.x, y);

        }
    }

    public relasePipe(node: Node): boolean {
        if (this._nodePool) {
            this._nodePool.put(node);
            return true;
        }
        return false;
    }
}
