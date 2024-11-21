import { _decorator, Component, EmptyDevice, math, nextPow2, Node, path, Tween, tween } from 'cc';
import BaseView from '../../ui/BaseView';
import { registerView } from '../../ui/ViewRegisterMgr';
import { PanelType } from '../../ui/PanelEnum';
import { LayerType } from '../../ui/LayerManager';
import { IRPGModelData, RPGConfig, RPGStateType } from './RPGConfig';
import ViewConst from '../../ui/ViewConst';
import AssetMgr from '../../Common/AssetMgr';
import { ModelCtrl } from './ModelCtrl';
import { RPGLauncher as RPGLauncher } from './RPGLauncher';
import { RPGModelAnimName } from './Enum';
const { ccclass, property } = _decorator;

@ccclass('RPGPanel')
export class RPGPanel extends BaseView {
    

    private orderIndex: number;
    private orderArrary: IRPGModelData[];

    private leftFightModels: Node[];
    private rightFightModels: Node[];

    private targetIndex: number;
    public async onOpen(fromUI: number | string, ...args: any) {
        this.initModelData();
        await this.initModel();
        this.orderIndex = 0;
        this.nextAttack();
    }

    private initModelData(): void{
        
        this.orderArrary = [];
        for (let i = 0; i < RPGConfig.ins.leftDatas.length; i++) {
            const element: IRPGModelData = RPGConfig.ins.leftDatas[i];
            const rightData: IRPGModelData = RPGConfig.ins.rightDatas[i];
            const copyData: IRPGModelData = {
                index: element.index,
                attack: element.attack,
                def: element.def,
                camp: element.camp,
                hp: element.hp,
                speed: element.speed,
                pos: element.pos,
                long: element.long,
                state:RPGStateType.Await
            }

            const copyRightData: IRPGModelData = {
                index: rightData.index,
                attack: rightData.attack,
                def: rightData.def,
                camp: rightData.camp,
                hp: rightData.hp,
                speed: rightData.speed,
                pos: rightData.pos,
                long: rightData.long,
                state: RPGStateType.Await
            }
            this.orderArrary[i] = copyData;
            this.orderArrary[i + 5] = copyRightData;
        }
    }

    private async initModel() {
        this.leftFightModels = [];
        this.rightFightModels = [];
        for (let i = 0; i < this.orderArrary.length; i++) {
            let data = this.orderArrary[i];
            let node = await this.createMode(data);
            if (data.camp === 0) {
                this.leftFightModels[data.index] = node;
            } else if (data.camp === 1) {
                this.rightFightModels[data.index] = node;
            }
        }
    }

    private async createMode(data:IRPGModelData){
        const path: string = ViewConst.defaultPrefabPathPrefix + "RPGModel";
        let node = await AssetMgr.instance.createPrefab(path);
        if (!node) {
            return;
        }

        node.setPosition(data.pos.x, data.pos.y);
        node.parent = this.node;
        const ctr: ModelCtrl = node.getComponent(ModelCtrl);
        if (ctr) {
            ctr.setModeData(data);
        }
        ctr.playAnimation(RPGModelAnimName.Idel);
        return node;
    }

    start() {

    }

    update(deltaTime: number) {
        
    }


    private getOrderArraryByCamp(camp: number): IRPGModelData[]{
        const result: IRPGModelData[] = [];
        for (let i = 0; i < this.orderArrary.length; i++) {
            const data = this.orderArrary[i];
            if (data.camp === camp && data.state != RPGStateType.Death) {
                result.push(data);
            }
        }
        return result;
    }

    private getOrderDataByIndex(index: number): IRPGModelData {
        for (let i = 0; i < this.orderArrary.length; i++) {
            const data = this.orderArrary[i];
            if (data.index === index && data.state != RPGStateType.Death) {
                return data;
            }
        }
        return null;
    }

    setModelState(obj: IRPGModelData, state: RPGStateType): void{
        if (state == RPGStateType.Move) {
            let targetCamp: number = 0;
            if (obj.camp == 0) {
                targetCamp = 1;
            }
            

            const campList: IRPGModelData[] = this.getOrderArraryByCamp(targetCamp);
            const index: number = RPGLauncher.ins.randomInt(0, campList.length - 1);
            console.log("随机出来的下标", index);
            let targetObj = campList[index];
            // for (let i = 0; i < this.orderArrary.length; i++) {
            //     const data = this.orderArrary[i];
            //     if (data.camp === targetCamp && data.state != RPGStateType.Idea) {
            //         targetObj = data;
            //         break;
            //     }
            // }
            this.targetIndex = null;
            if (targetObj) {
                this.targetIndex = targetObj.index;
                this.move(obj, targetObj).then((value) => { 
                    this.setModelState(obj, RPGStateType.Attack);
                    
                }).catch(err => { 
                    console.error(err);
                })
            } else {
                if (targetCamp == 1) {
                    console.error("你赢了");
                } else { 
                    console.error("你输了");
                }
            }
        } else if (state == RPGStateType.Attack) {
            if (this.targetIndex != null) {
                let  targetCamp = 0;
                if (obj.camp == 0) {
                    targetCamp = 1;
                }

                const targetData = this.getOrderDataByIndex(this.targetIndex);
                this.attack(obj, targetData).then((value1) => {
                    console.error("执行到攻击返回步骤了")
                    this.move(obj, obj,true).then((value) => {
                        if (value1 <= 0) {
                            this.setModelState(targetData, RPGStateType.Death);
                        } 
                        this.orderIndex += 1;
                        this.nextAttack();
                    }).catch(err => {
                        console.error(err);
                    })
                    
                }).catch(err => { 
                    console.error(err);
                })
            }
        } else if (state == RPGStateType.Death) {
            if (obj) {
                for (let index = 0; index < this.orderArrary.length; index++) {
                    const element = this.orderArrary[index];
                    if (element.index == obj.index) {
                        // this.orderArrary.splice(index, 1);
                        element.state = RPGStateType.Death;
                        break;
                    }
                }
                const model: Node = this.getTargetModel(obj);
                if (model) {
                    console.error(`${obj.index}被打死了!!!!`);
                    model.removeFromParent();
                }
            }
        }

    }

    // private updateTargetHp(target: IRPGModelData, currentHp: number): void{
    //     if (!target) {
    //         return;
    //     }
        
    // }

    private getTargetModel(target: IRPGModelData): Node{
        let model: Node = null;
        if (target.camp == 0) {
            model = this.leftFightModels[target.index];
        } else if (target.camp == 1) {
            model = this.rightFightModels[target.index];
        }
        return model;
    }

    private attack(attacker: IRPGModelData, target: IRPGModelData): Promise<any> {
        return new Promise((resolve, rejecet) => {
            if (!attacker || !target) { 
                rejecet("攻击数据为空");
                return;
            }
            const targetData = this.orderArrary[target.index];
            if (!targetData) {
                rejecet("攻击对象没找到");
                return;
            }
            const targetCurrentHp: number = (target.hp + target.def) - attacker.attack;
            target.hp = targetCurrentHp;
            let model: Node = this.getTargetModel(target);
            if (!model) {
                rejecet("目标模型没找到");
                return;
            }
            const modelCtr: ModelCtrl = model.getComponent(ModelCtrl);
            if (!modelCtr) {
                rejecet("模型没有绑定管理脚本");
                return;
            }
            const attackModel: Node = this.getTargetModel(attacker);
            if (attackModel) {
                const attackCtr: ModelCtrl = attackModel.getComponent(ModelCtrl);
                if (attackCtr) {
                    attackCtr.playAnimation(RPGModelAnimName.Attack).then(value => { 
                        console.error(`${attacker.index} 攻击了${target.index},造成了${attacker.attack}伤害,防御了${target.def},还剩${target.hp}`);
                        modelCtr.setHp(targetCurrentHp / 100);
                        resolve(targetCurrentHp);
                    }).catch(err => { 
                        console.error(err);
                    });
                }
            }
        })
    }

    private move(obj: IRPGModelData, target: IRPGModelData,isBack:boolean = false): Promise<any>{
        return new Promise((resolve, reject) => { 
            if (!obj || !target) {
                reject("数据为空");
                return;
            }
            let model: Node = this.getTargetModel(obj);
            if (!model) {
                reject("模型为空")
                return;
            }
            const ctr: ModelCtrl = model.getComponent(ModelCtrl);
            
            if (ctr) {
                if (isBack) {
                    ctr.rotationDiretion();
                }
                ctr.playAnimation(RPGModelAnimName.Walk);
            }
            tween(model).to(1, { position: math.v3(target.pos.x, target.pos.y, 0) }).call((target, data) => {
                if (ctr) {
                    if (isBack) {
                        ctr.rotationDiretion();
                    }
                    ctr.playAnimation(RPGModelAnimName.Idel,0);
                }
                resolve(true);
            }, this).start();
        })
        
    }


    nextAttack(): void{
        if (this.orderIndex > 9) {
            this.orderIndex = 0;
        }
        const attacker: IRPGModelData = this.orderArrary[this.orderIndex];
        if (attacker.state === RPGStateType.Await) {
            this.setModelState(attacker, RPGStateType.Move);
        } else {
            this.orderIndex += 1;
            this.nextAttack();
        }
    }
}
registerView({ viewCls: RPGPanel, id: PanelType.RPGPanel, layer: LayerType.view })

