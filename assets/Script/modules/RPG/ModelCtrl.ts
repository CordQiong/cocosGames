import { _decorator, Component, math, Node, ProgressBar, Sprite } from 'cc';
import Utils from '../../Common/Utils';
import { IRPGModelData, RPGConfig } from './RPGConfig';
const { ccclass, property } = _decorator;

@ccclass('ModelCtrl')
export class ModelCtrl extends Component {

    private spNode: Node;
    private progressNode: Node;

    private modelData: IRPGModelData;

    protected onLoad(): void {
        this.spNode = Utils.FindChildByName(this.node, "player");
        this.progressNode = Utils.FindChildByName(this.node, "ProgressBar");
    }

    start() {

    }

    update(deltaTime: number) {
        
    }

    setModeData(data: IRPGModelData): void{
        this.modelData = data;
        this.setColor(data.index);
        this.setHp(data.hp / 100);
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


