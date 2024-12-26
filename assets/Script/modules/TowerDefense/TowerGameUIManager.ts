import { _decorator, Component, Label, math, Node, NodePool, Sprite, Vec3 } from 'cc';
import { TowerConfig } from "db://assets/Script/modules/TowerDefense/TowerConfig";
import { SelectTowerBuild } from "db://assets/Script/modules/TowerDefense/SelectTowerBuild";
import { TowerBuildInfo } from "db://assets/Script/modules/TowerDefense/info/TowerBuildInfo";
import { RemoveOrUpLevel } from './RemoveOrUpLevel';

const { ccclass, property } = _decorator;

@ccclass('GameUIManager')
export class TowerGameUIManager extends Component {

    private static _instance: TowerGameUIManager;
    public static get instance(): TowerGameUIManager {
        if (!TowerGameUIManager._instance) {
            TowerGameUIManager._instance = new TowerGameUIManager();
        }
        return TowerGameUIManager._instance;
    }

    @property(Label)
    public turnipLabel: Label = null;
    @property(Node)
    public selectedTowerNode: Node = null;
    @property(Node)
    public removeOrUpdate: Node = null;

    private _nodePool: NodePool = null;

    protected onLoad() {
        if (!TowerGameUIManager._instance) {
            TowerGameUIManager._instance = this;
        } else {
            this.destroy();
        }
    }

    start() {
        this._nodePool = new NodePool();
    }

    update(deltaTime: number) {

    }

    public updateValue(value: number): void {
        if (this.turnipLabel) {
            this.turnipLabel.string = value.toString();
        }
    }

    public get reomoveUpdateState(): boolean {
        if (this.removeOrUpdate) {
            return this.removeOrUpdate.active;
        }
        return false;
    }

    public set reomoveUpdateState(show: boolean) {
        if (this.removeOrUpdate) {
            this.removeOrUpdate.active = show;
        }
    }

    public get selectedTowerState(): boolean {
        if (this.selectedTowerNode) {
            return this.selectedTowerNode.active;
        }
        return false;
    }

    public set selectedTowerState(value: boolean) {
        if (this.selectedTowerNode) {
            this.selectedTowerNode.active = value;
        }
    }

    public showRemoveOrUpdate(show: boolean, buildInfo?: TowerBuildInfo, selectCall: (handlerType: number, buildInfo: TowerBuildInfo) => void = null, callObj: any = null): void {
        if (!this.removeOrUpdate) {
            return;
        }
        this.reomoveUpdateState = show;
        if (show && buildInfo) {
            this.removeOrUpdate.setPosition(buildInfo.node.position.clone());
            const script: RemoveOrUpLevel = this.removeOrUpdate.getComponent(RemoveOrUpLevel);
            if (script) {
                script.updateInfo(buildInfo, selectCall, callObj);
            }

        }
    }

    /**
     * 显示选择塔建造
     * @param show 是否显示
     * @param buildInfo
     * @param selectCall 选择回调函数
     * @param selectObj 选择回调函数对象
     */
    public showSelectTower(show: boolean, buildInfo?: TowerBuildInfo, selectCall: (buildInfo: TowerBuildInfo) => void = null, selectObj: any = null): boolean {
        if (!this.selectedTowerNode) {
            return false;
        }
        this.selectedTowerState = show;

        const childrenCount: number = this.selectedTowerNode.children.length;

        for (let i = childrenCount - 1; i >= 0; i--) {
            const child = this.selectedTowerNode.children[i]
            child.removeFromParent();
            this._nodePool.put(child);
        }

        if (show) {
            this.selectedTowerNode.setPosition(buildInfo.node.position.clone());
            const mapData = TowerConfig.instance.getMapData();
            if (mapData) {
                const canBuildTowers: number[] = mapData.canBuildTowerIds;
                for (let i = 0; i < canBuildTowers.length; i++) {
                    const towerId: number = canBuildTowers[i];
                    const towerBuild: SelectTowerBuild = this.getNode();
                    this.selectedTowerNode.addChild(towerBuild.node);

                    towerBuild.setTowerId(towerId);
                    towerBuild.setBuildInfo(buildInfo)
                    towerBuild.setClickCall(selectCall, selectObj);
                }
            }
        }
    }

    private getNode(): SelectTowerBuild {
        if (this._nodePool.size() > 0) {
            const node: Node = this._nodePool.get();
            let build: SelectTowerBuild = node.getComponent(SelectTowerBuild);
            if (!build) {
                build = node.addComponent(SelectTowerBuild);
            }
            node.addComponent(Sprite);
            return build;
        }
        const node = new Node();
        node.addComponent(Sprite);
        return node.addComponent(SelectTowerBuild);
    }
}


