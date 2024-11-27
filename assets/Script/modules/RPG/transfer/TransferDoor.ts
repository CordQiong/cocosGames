
import {Node, CCInteger, CCString, Component, Label, _decorator, Vec3 } from "cc";
import Player from "../character/Player";
import { EditTransferData } from "../EditObjData";


const { ccclass, property } = _decorator;

/**
 * 传送门
 */
@ccclass('TransferDoor')
export default class TransferDoor extends Component {

    /**
     * 传送到目标地图Id
     */
    @property(CCString)
    public targetMapId: string = "";

    /**
     * 传送到目标地图的出生点Id
     */

    @property(CCInteger)
    public targetMapSpawnId: number = 0;

    /**
     * 魔法值
     */
    @property(Label)
    public nameTxt:Label = null;

    /**
     * 用于显示角色名字的接口
     */
     private _objName: string = "";
     public get objName(): string {
         return this._objName;
     }
     public set objName(value: string) {
         this._objName = value;
 
         if(this.nameTxt == null)
         {
             this.nameTxt = this.node.getChildByName("NameTxt")?.getComponent(Label);
         }
 
         if(this.nameTxt)
         {
             this.nameTxt.string = this._objName;
         }
     }

    /**
     * 编辑的数据
     */
    private editData:EditTransferData = null;

    

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

        //this.node.opacity = 0;
    }

    /**
     * 初始化
     */
    public init()
    {

    }

    /**
     * 初始化编辑数据
     * @param editData 
     */
    public initEditData(editData:EditTransferData)
    {
        this.editData = editData;

        this.objName = editData.objName;
        this.node.position = new Vec3(editData.x,editData.y);

        this.targetMapId = editData.targetMapId;
        this.targetMapSpawnId = editData.targetMapSpawnId;
    }

    // update (dt) {}

    public toString()
    {
        return this.targetMapId + "," + this.targetMapSpawnId;
    }

    /**
     * 角色进入传送门
     * @param callback 
     */
    public onTriggerEnter(player:Player)
    {
        if(player != null)
        {
            console.log("跳转到地图",this.targetMapId, this.targetMapSpawnId);
        }
    }

    /**
     * 角色从传送们出来
     * @param callback 
     */
    public onTriggerExit(player:Player)
    {
        //
    }
}
