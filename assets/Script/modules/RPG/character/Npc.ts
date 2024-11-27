import { _decorator, Component, Node, Vec3 } from 'cc';
import Character from './Character';
import { EditNpcData } from '../EditObjData';
const { ccclass, property } = _decorator;

@ccclass('Npc')
export class Npc extends Character {

    public npcId: number = 0;
    public defaultDir: number = 0;

    private editData: EditNpcData = null;
    start() {

    }

    update(deltaTime: number) {
        
    }

    public init() {
        // this.width = 100;
        // this.height = 100;
        this.direction = this.defaultDir;
        // this.loadRes();
    }

    public initEditData(editData: EditNpcData) {
        this.editData = editData;

        this.objName = editData.objName;
        this.npcId = Number(editData.objId);
        this.node.position = new Vec3(editData.x, editData.y);
        this.defaultDir = editData.direction;
        // this.isPatrol = editData.isPatrol;
    }
}


