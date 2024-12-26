import {Animation, AnimationClip, Node, NodePool, Vec3} from "cc";
import ViewConst from "db://assets/Script/ui/ViewConst";
import AssetMgr from "db://assets/Script/Common/AssetMgr";
import * as cc from "cc";

export class EffectManager  {
    private static _instance: EffectManager;
    public static get instance(): EffectManager {
        if(!this._instance){
            this._instance = new EffectManager();
        }
        return this._instance;
    }

    constructor() {
        this._nodePool = new NodePool();
    }

    private _nodePool: NodePool;
    private _effectLayer:Node;

    public initEffectLayer(layer:Node):void{
        this._effectLayer = layer;
    }

    private async getNode():Promise<Node> {
        if(this._nodePool && this._nodePool.size() > 0){
            return this._nodePool.get();
        }else {
            let prefabPath = ViewConst.defaultPrefabPathPrefix + "tower/effect";
            let node = await AssetMgr.instance.createPrefab(prefabPath);
            return node;
        }
    }

    public showEffect (name:string,position:Vec3):Promise<void> {
        return new Promise(async (resolve,reject) => {
            let node = await this.getNode();
            if (!node) {
                console.error(` ***** tower/effect is not exist ***** `);
                resolve(null);
                return;
            }
            node.setPosition(position);
            if(this._effectLayer){
                this._effectLayer.addChild(node);
            }
            const animation:Animation = node.getComponent(Animation);
            if(!animation) {
                reject(`***** animation is not exist ***** `);
                return;
            }
            const clips = animation.clips;
            const effectNames: string[] = clips.map(clip => clip.name);
            if(!effectNames.length || effectNames.indexOf(name) === -1) {
                reject(`***** effect name is not exist ***** `);
                return;
            }
            const playClip:AnimationClip = clips.find((clip) => clip.name === name);
            if(!playClip) {
                reject(`***** playClip is not exist ***** `);
                return;
            }
            if(playClip.wrapMode ==1){
                animation.on(Animation.EventType.FINISHED,()=>{
                    this._nodePool.put(node);
                    node.removeFromParent();
                    resolve()
                },this)
            }
            animation.play(name);
            if(playClip.wrapMode == 2){
                resolve()
            }
        })
    }
}
