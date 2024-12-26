import { Node, NodePool, UITransform } from "cc";

/**
 * @fileName NodeFactory.ts
 * @author zhangqiong
 * @date 2024/12/18 16:36:10"
 * @description
 */
export class NodeFactory {
    private static _instance: NodeFactory;
    public static get instance(): NodeFactory {
        if (!NodeFactory._instance) {
            NodeFactory._instance = new NodeFactory();
        }
        return NodeFactory._instance;
    }

    private _nodePool: NodePool;
    constructor() {
        this._nodePool = new NodePool();
    }

    public createNode(): Node {
        let node: Node = null;
        if (this._nodePool.size() > 0) {
            node = this._nodePool.get();
        } else {
            node = new Node();
        }
        return node;
    }

    public release(node: Node): void {
        if (this._nodePool) {
            this._nodePool.put(node);
        }
    }
}
