import { _decorator, Component, Node, Vec3 } from 'cc';
import Character from './Character';
import { EditMonsterData } from '../EditObjData';
const { ccclass, property } = _decorator;

@ccclass('Monster')
export class Monster extends Character {
    
    public monsterId: number = 0;
    public defaultDir: number = 0;

    /**
     * 编辑的数据
     */
    private editData: EditMonsterData = null;
    start() {

    }

    /**
     * 初始化
     */
    public init() {
        // this.width = 100;
        // this.height = 100;
        this.direction = this.defaultDir;

        // this.loadRes();
    }

    update(deltaTime: number) {
        
    }

    public initEditData(editData): void { 
        this.editData = editData;

        this.objName = editData.objName;
        this.monsterId = Number(editData.objId);
        this.node.position = new Vec3(editData.x, editData.y);
        this.defaultDir = editData.direction;
        // this.isPatrol = editData.isPatrol;
    }
}


