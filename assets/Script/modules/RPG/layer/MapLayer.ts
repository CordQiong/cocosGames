
import { Node, Component, _decorator, Sprite, UITransform, SpriteFrame } from "cc";
import MapParams from "../info/MapParams";

const { ccclass, property } = _decorator;

@ccclass("MapLayer")
export default class MapLayer extends Component {

    @property(Sprite)
    private bgImg: Sprite = null;

    protected _mapParams: MapParams = null;

    protected update(dt: number): void {
       
    }

    public init(mapParams: MapParams): void { 
        this._mapParams = mapParams;
        if (!this.bgImg) {
            const bgNode: Node = new Node();
            this.node.addChild(bgNode);
            bgNode.layer = this.node.layer;

            this.bgImg = bgNode.addComponent(Sprite);
            this.bgImg.sizeMode = Sprite.SizeMode.RAW;
            bgNode.getComponent(UITransform).anchorX = 0;
            bgNode.getComponent(UITransform).anchorY = 0;
        }
        const spriteFrame: SpriteFrame = new SpriteFrame();
        spriteFrame.texture = mapParams.bgTex;
        this.bgImg.spriteFrame = spriteFrame;


        this.getComponent(UITransform).width = this.width;
        this.getComponent(UITransform).height = this.height;
    }

    public get bgImage(): Sprite {
        return this.bgImg;
    }

    public get width(): number {
        if (this.bgImg) {
            return this.bgImg.getComponent(UITransform).width;
        }

        return this._mapParams.viewWidth;
    }

    public get height(): number {
        if (this.bgImg) {
            return this.bgImg.getComponent(UITransform).height;
        }

        return this._mapParams.viewHeight;
    }
}