import { _decorator, Component, Node } from 'cc';
import BaseView from '../../ui/BaseView';
import { registerView } from '../../ui/ViewRegisterMgr';
import { PanelType } from '../../ui/PanelEnum';
import { LayerType } from '../../ui/LayerManager';
const { ccclass, property } = _decorator;

@ccclass('FairybirdMainPanel')
export class FairybirdMainPanel extends BaseView {

    public onOpen(fromUI: number | string, ...args: any): void {
        console.log("成功打开了", fromUI, args)
        const count: number = 10;
        for (let i: number = 0; i < count; i++){
            console.log(`random value:${this.seedRandom()}`);
        }
    }

    private seed: number = 5;
    private initSeed: number = 5;
    private logRandomArray: number[] = [];

    public setRandomSeed(seed: number): void{
        this.initSeed = seed;
        console.error("收到随机数", this.initSeed);
    }

    public seedRandom(): number{
        if (this.logRandomArray.length < 30) {
            this.logRandomArray.push(this.seed);
        }
        this.seed = (this.seed * 9301 + 49297) % 233280;
        const value: number = this.seed / 233280.0;
        return value;
    }




    public onClose() {

    }




    start() {

    }

    update(deltaTime: number) {
        // console.log("long deltatime",deltaTime)
    }
}
registerView({ viewCls: FairybirdMainPanel, id: PanelType.FairybirdMainPanel, layer: LayerType.view })

