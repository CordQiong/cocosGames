import {_decorator, Component, Node, resources, Sprite, SpriteFrame, Texture2D, UITransform} from 'cc';
import MapLayer from "db://assets/Script/modules/RPG/layer/MapLayer";
import MapParams from "db://assets/Script/modules/RPG/info/MapParams";
import {TowerLauncher} from "db://assets/Script/modules/TowerDefense/TowerLauncher";
import { AnimationPath } from './AnimationPath';
const { ccclass, property } = _decorator;

@ccclass('TowerMapLayer')
export class TowerMapLayer extends MapLayer {
    @property(Sprite)
    private baseImage: Sprite = null;
    @property(AnimationPath)
    public animationPath: AnimationPath = null;
    @property(Node)
    public roadNode: Node = null;
    protected onLoad(): void {
        if (!this.animationPath) {
            this.animationPath = this.node.getComponentInChildren(AnimationPath);
        }
    }

    init(mapParams: MapParams) {
        super.init(mapParams);
        if(!this.baseImage){
            const bgNode: Node = new Node();
            this.node.addChild(bgNode);
            bgNode.layer = this.node.layer;

            this.baseImage = bgNode.addComponent(Sprite);
            this.baseImage.sizeMode = Sprite.SizeMode.RAW;
            bgNode.getComponent(UITransform).anchorX = 0;
            bgNode.getComponent(UITransform).anchorY = 0;
        }

        this.loadBg();
    }

    public loadBg():void{
        const themeId:number = TowerLauncher.instance.theme;
        const path:string = `tower/map/theme${themeId}/BG${themeId}/texture`

        resources.load(path, Texture2D, (error: Error, tex: Texture2D) => {
            if (error != null) {
                console.log("加载地图背景失败 path = ", path, "error", error);
                return;
            }
            const spriteFrame:SpriteFrame = new SpriteFrame();
            spriteFrame.texture = tex;
            this.baseImage.spriteFrame = spriteFrame;

            this.getComponent(UITransform).width = this.width;
            this.getComponent(UITransform).height = this.height;
        });
    }

    public get width(): number {
        if (this.baseImage) {
            return this.baseImage.getComponent(UITransform).width;
        }

        return this._mapParams.viewWidth;
    }

    public get height(): number {
        if (this.baseImage) {
            return this.baseImage.getComponent(UITransform).height;
        }

        return this._mapParams.viewHeight;
    }
}
