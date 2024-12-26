import {_decorator, Component, EventTouch, NodeEventType, resources, Sprite, SpriteFrame, Texture2D, Vec3} from 'cc';
import {TowerConfig} from "db://assets/Script/modules/TowerDefense/TowerConfig";
import {TowerLauncher} from "db://assets/Script/modules/TowerDefense/TowerLauncher";
import {TowerGameUIManager} from "db://assets/Script/modules/TowerDefense/TowerGameUIManager";
import { TowerBuildInfo } from './info/TowerBuildInfo';

const { ccclass, property } = _decorator;

@ccclass('SelectTowerBuild')
export class SelectTowerBuild extends Component {

    private callBack:(buildInfo:TowerBuildInfo) => void;
    private callObj:any;

    private towerId:number;
    private level:number;
    public buildInfo:TowerBuildInfo;

    private towerData:{buildCost:number,removeBack:number} = null;
    start() {
        this.node.on(NodeEventType.TOUCH_START, this.onTouchNode,this);
    }

    private onTouchNode(event:EventTouch):void{
        if(!this.towerData){
            console.error("当前选中塔的配置不存在");
            return;
        }
        if(TowerLauncher.instance.value >= this.towerData.buildCost){
            if(this.callBack && this.callObj){
                this.buildInfo.selectedTowerId = this.towerId;
                this.callBack.call(this.callObj,this.buildInfo);
                TowerGameUIManager.instance.showSelectTower(false);
            }
        }
    }

    public setTowerId(id:number,level:number = 1):void{
        this.towerId = id;
        this.level = level;

        const towerData = TowerConfig.instance.getTowerConfig(this.towerId,this.level);
        if(towerData){
            this.towerData = towerData;
            const canBuild:boolean = TowerLauncher.instance.value >= towerData.buildCost;
            const buildPath:string = `tower/res/NormalMordel/Game/Tower/${this.towerId}/CanClick${canBuild ? 1 : 0}/texture`;
            resources.load(buildPath,Texture2D,(err,tex:Texture2D)=>{
                if(err){
                    console.error(err.stack);
                    return;
                }
                const sprite:Sprite = this.node.getComponent(Sprite);
                const spf:SpriteFrame = new SpriteFrame();
                spf.texture = tex;
                sprite.spriteFrame = spf;
            })

        }
    }

    public setBuildInfo(buildInfo:TowerBuildInfo){
        this.buildInfo = buildInfo;
    }

    public setClickCall(call:(buildInfo:TowerBuildInfo)=>void,callObj:any):void{
        this.callBack = call;
        this.callObj = callObj;
    }

    update(deltaTime: number) {
        
    }
}


