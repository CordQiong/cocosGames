import { _decorator, Component, dragonBones, math, Node, ProgressBar, Sprite } from 'cc';
import Utils from '../../Common/Utils';
import { IRPGModelData, RPGConfig } from './RPGConfig';
import { RPGModelAnimName, RPGModelDirection } from './Enum';
const { ccclass, property } = _decorator;

@ccclass('ModelCtrl')
export class ModelCtrl extends Component {

    private spNode: Node;
    private progressNode: Node;

    private modelData: IRPGModelData;

    private diretion: RPGModelDirection;
    private currentDiretion: RPGModelDirection;
    protected onLoad(): void {
        this.spNode = Utils.FindChildByName(this.node, "player");
        this.progressNode = Utils.FindChildByName(this.node, "ProgressBar");
    }

    start() {

    }

    update(deltaTime: number) {
        
    }

    public playAnimation(name: RPGModelAnimName,time:number = 1): Promise<boolean>{
        return new Promise((resolve, reject) => {
            if (this.spNode) {
                const dr = this.spNode.getComponent(dragonBones.ArmatureDisplay);
                if (dr) {
                    if (time != 0) {
                        dr.addEventListener(dragonBones.EventObject.COMPLETE, () => {
                            resolve(true);
                        }, this)
                        dr.playAnimation(name, time)
                    } else { 
                        dr.playAnimation(name, time)
                        resolve(true);
                    }
                    
                    
                } else {
                    reject(false);
                }
            } else {
                reject(false);
            }
        })
    }

    setModeData(data: IRPGModelData): void{
        this.modelData = data;
        this.diretion = data.camp == 0 ? RPGModelDirection.Left : RPGModelDirection.Right;
        this.currentDiretion = this.diretion;
        if (data.camp == 1) {
            this.node.setScale(-1, 1);
        }
        // this.setColor(data.index);
        this.setHp(data.hp / 100);
    }

    /**
     * 转换方向
     * @returns 
     */
    public rotationDiretion(): boolean{
        let newDiretion: RPGModelDirection = null;
        if (this.currentDiretion == RPGModelDirection.Left) {
            newDiretion = RPGModelDirection.Right;
        } else if (this.currentDiretion == RPGModelDirection.Right) {
            newDiretion = RPGModelDirection.Left;
        }

        let sacleX: number = 1;
        if (newDiretion === RPGModelDirection.Right) {
            sacleX = -1;
        }
        this.node.setScale(sacleX, 1);
        this.currentDiretion = newDiretion;
        return true;
    }

    public setColor(index: number): void{
        if (this.spNode) {
            const color: string = RPGConfig.ins.colors[index];
            this.spNode.getComponent(Sprite).color = math.color(color);
        }
    }

    setHp(value: number): void{
        if (this.progressNode) {
            const progress: ProgressBar = this.progressNode.getComponent(ProgressBar);
            if (progress) {
                progress.progress = value;
            }
        }
    }
}


