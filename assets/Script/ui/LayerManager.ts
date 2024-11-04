import { Node, UITransform, Widget } from "cc";

export enum LayerType {
    none,
    view,
    window,

    end,
}

export default class LayerManager {
    private static inited: boolean = false;
    private static layers: { [key: number]: Node };

    public static width: number;
    public static height: number;
    public static root: Node;

    public static init(root: Node): void {
        if (this.inited) {
            return;
        }
        this.layers = {};
        this.inited = true;
        this.root = root;
        let rootTr: UITransform = this.root.getComponent(UITransform);
        if (!rootTr) {
            rootTr = this.root.addComponent(UITransform);
        }
        this.width = rootTr.width || 750;
        this.height = rootTr.height || 1334;

        for (let type = 0; type < LayerType.end; type++) {
            if (type != LayerType.none) {
                this.createLayer(type);
            }
        }
    }

    private static createLayer(layer: LayerType, parent?: Node) {
        const node: Node = new Node();
        node.name = `layer_${layer}`;
        if (!parent) parent = this.root;
        let uiTr: UITransform = node.getComponent(UITransform);
        if (!uiTr) {
            uiTr = node.addComponent(UITransform)
        }

        uiTr.setContentSize(this.width, this.height);
        let widget = node.addComponent(Widget);
        widget.left = widget.right = widget.top = widget.bottom = 0;
        widget.target = parent;
        node.parent = parent;
        widget.updateAlignment();
        this.layers[layer] = node;
        return node;
    }

    public static getLayer(layer: LayerType): Node {
        return this.layers[layer];
    }
}