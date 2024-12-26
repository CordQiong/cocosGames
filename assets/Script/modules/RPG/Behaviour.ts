import { _decorator, Component, Node, ITriggerEvent, Collider, UITransform, Vec3, UIOpacity, CCString, Collider2D, Contact2DType, IPhysics2DContact, ICollisionEvent } from "cc";
import { Transform } from "./Transform";
import { GameObject } from "./GameObject";
import { QuadTreeRect } from "../../Common/QuadTree";

const { ccclass, property } = _decorator;

/**
 * 行为组件
 */
@ccclass("Behaviour")
export class Behaviour extends Component {
    
    public get rect(): QuadTreeRect { 
        const postioion = this.node.position.clone();
        return new QuadTreeRect(postioion.x, postioion.y, this.width, this.height);
    }
    /**
     * 对象标识
     */
    @property({tooltip:"对象标识"})
    public tag:string = "";

    private colliders_2D:Collider2D[] = null;
    private colliders_3D:Collider[] = null;

    private _transform:Transform = null;
    public get transform():Transform
    {
        if(!this._transform)
        {
            this._transform = this.node as Transform;
        }

        return this._transform;
    }

    private _gameObject: GameObject = null;
    public get gameObject():GameObject
    {
        if(!this._gameObject)
        {
            this._gameObject = this.node as GameObject;
        }

        return this._gameObject;
    }

    private _uiTransform:UITransform = null;
    public get uiTransform():UITransform
    {
        if(!this._uiTransform)
        {
            this._uiTransform = this.node.getComponent(UITransform);
        }

        return this._uiTransform;
    }

    private _uiOpacity: UIOpacity = null;
    public get uiOpacity(): UIOpacity {

        if(!this._uiOpacity)
        {
            this._uiOpacity = this.node.getComponent(UIOpacity);
        }

        return this._uiOpacity;
    }

    //--------------------------------设置宽高 begin---------------------------------------------
    public get width(): number {

        if(this.uiTransform)
        {
            return this.uiTransform.width;
        }

        return 0;
    }
    public set width(value: number) {
        if(this.uiTransform)
        {
            this.uiTransform.width = value;
        }
    }

    public get height(): number {
        if(this.uiTransform)
        {
            return this.uiTransform.height;
        }

        return 0;
    }
    public set height(value: number) {
        if(this.uiTransform)
        {
            this.uiTransform.height = value;
        }
    }
    //--------------------------------设置宽高 end---------------------------------------------

    //--------------------------------设置透明度 begin---------------------------------------------
    private _alpha: number = 1;
    public get alpha(): number {
        return this._alpha;
    }
    /**alpha值的范围是 0-1 */
    public set alpha(value: number) {
        this._alpha = value;

        if(this._alpha < 0)
        {
            this._alpha = 0;
        }else if(this._alpha > 1)
        {
            this._alpha = 1;
        }

        if(this.uiOpacity != null)
        {
            this.uiOpacity.opacity = 255 * (this._alpha / 1);
        }
    }

    private _opacity: number = 255;
    public get opacity(): number {
        return this._opacity;
    }
    /**opacity值的范围是 0-255 */
    public set opacity(value: number) {
        this._opacity = value;
        
        if(this._opacity < 0)
        {
            this._opacity = 0;
        }else if(this._opacity > 255)
        {
            this._opacity = 255;
        }

        if(this.uiOpacity != null)
        {
            this.uiOpacity.opacity = this._opacity;
        }
    }
    //--------------------------------设置透明度 end---------------------------------------------

    //--------------------------------局部坐标 begin---------------------------------------------
    public get x(): number {
        return this.transform.position.x;
    }
    public set x(value: number) {
        var pos:Vec3 = this.transform.position;
        pos.x = value;
        this.transform.position = pos;
    }

    public get y(): number {
        return this.transform.position.y;
    }
    public set y(value: number) {
        var pos:Vec3 = this.transform.position;
        pos.y = value;
        this.transform.position = pos;
    }

    public get z(): number {
        return this.transform.position.z;
    }
    public set z(value: number) {
        var pos:Vec3 = this.transform.position;
        pos.z = value;
        this.transform.position = pos;
    }
    //---------------------------------局部坐标 end-----------------------------------------------

    //--------------------------------世界坐标 begin----------------------------------------------
    public get wx(): number {
        return this.transform.worldPosition.x;
    }
    public set wx(value: number) {
        var pos:Vec3 = this.transform.worldPosition;
        pos.x = value;
        this.transform.worldPosition = pos;
    }

    public get wy(): number {
        return this.transform.worldPosition.y;
    }
    public set wy(value: number) {
        var pos:Vec3 = this.transform.transform.worldPosition;
        pos.y = value;
        this.transform.worldPosition = pos;
    }

    public get wz(): number {
        return this.transform.worldPosition.z;
    }
    public set wz(value: number) {
        var pos:Vec3 = this.transform.worldPosition;
        pos.z = value;
        this.transform.worldPosition = pos;
    }
    //--------------------------------世界坐标 end----------------------------------------------

    onLoad()
    {
        this.addColliderEventListener();
    }

    /**
     * 监听碰撞事件
     */
    protected addColliderEventListener()
    {
        this.add2DColliderEventListener();
        this.add3DColliderEventListener();
    }

    /**
     * 2D 触发器进入函数
     * @param selfCollider 自己的碰撞体
     * @param otherCollider 对方的碰撞体
     * @param contact
     * @protected
     */
    protected onTriggerEnter2D(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null):void{

    }

    /**
     * 2D 触发器结束函数
     * @param selfCollider
     * @param otherCollider
     * @param contact
     * @protected
     */
    protected onTriggerExit2D(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null):void{

    }

    /**
     * 2D 碰撞器进入函数
     * @param selfCollider
     * @param otherCollider
     * @param contact
     * @protected
     */
    protected onCollisionEnter2D(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null):void{

    }

    /**
     * 2D 碰撞器退出函数
     * @param selfCollider
     * @param otherCollider
     * @param contact
     * @protected
     */
    protected onCollisionExit2D(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null):void{

    }

    /**
     * 监听2d碰撞事件
     */
    protected add2DColliderEventListener()
    {
        let i;
        this.colliders_2D = this.getComponents(Collider2D);

        for(i = 0; i < this.colliders_2D.length ; i++)
        {
            this.colliders_2D[i].on(Contact2DType.BEGIN_CONTACT,this.onTriggerEnter2D,this);
        }

        for(i = 0; i < this.colliders_2D.length ; i++)
        {
            this.colliders_2D[i].on(Contact2DType.END_CONTACT,this.onTriggerExit2D,this);
        }

        for(i = 0; i < this.colliders_2D.length ; i++)
        {
            this.colliders_2D[i].on(Contact2DType.BEGIN_CONTACT,this.onCollisionEnter2D,this);
        }

        for(i = 0; i < this.colliders_2D.length ; i++)
        {
            this.colliders_2D[i].on(Contact2DType.END_CONTACT,this.onCollisionExit2D,this);
        }

    }

    /**
     * 3D 触发器进入函数
     * @param event
     * @protected
     */
    protected onTriggerEnter(event:ITriggerEvent):void{

    }

    /**
     * 3D 触发器持续函数
     * @param event
     * @private
     */
    private onTriggerStay(event:ITriggerEvent):void{

    }

    /**
     * 3D 触发器退出函数
     * @param event
     * @private
     */
    private onTriggerExit(event:ITriggerEvent):void{

    }

    /**
     * 3D 碰撞器进入函数
     * @param event
     * @private
     */
    private onCollisionEnter(event: ICollisionEvent):void{

    }

    /**
     * 3D 碰撞器持续函数
     * @param event
     * @private
     */
    private onCollisionStay(event:ICollisionEvent):void{

    }

    /**
     * 3D 碰撞器退出函数
     * @param event
     * @private
     */
    private onCollisionExit(event:ICollisionEvent):void{

    }

    /**
     * 监听3d碰撞事件
     */
    protected add3DColliderEventListener()
    {
        this.colliders_3D = this.getComponents(Collider);

        for(let i = 0 ; i < this.colliders_3D.length ; i++)
        {
            this.colliders_3D[i].on("onTriggerEnter", this.onTriggerEnter,this);
        }

        for(let i = 0 ; i < this.colliders_3D.length ; i++)
        {
            this.colliders_3D[i].on("onTriggerStay",this.onTriggerStay,this);
        }

        for(let i = 0 ; i < this.colliders_3D.length ; i++)
        {
            this.colliders_3D[i].on("onTriggerExit",this.onTriggerExit,this);
        }

        for(let i = 0 ; i < this.colliders_3D.length ; i++)
        {
            this.colliders_3D[i].on("onCollisionEnter",this.onCollisionEnter,this);
        }

        for(let i = 0 ; i < this.colliders_3D.length ; i++)
        {
            this.colliders_3D[i].on("onCollisionStay",this.onCollisionStay,this);
        }

        for(var i = 0 ; i < this.colliders_3D.length ; i++)
        {
            this.colliders_3D[i].on("onCollisionExit",this.onCollisionExit,this);
        }
    }


    /**
     * 注销所有碰撞事件
     */
    protected removeAllColliderEventListener()
    {
        if(this.colliders_2D)
        {
            for(let i = 0 ; i < this.colliders_2D.length ; i++)
            {
                this.colliders_2D[i].off(Contact2DType.BEGIN_CONTACT,this.onTriggerEnter2D,this);
                this.colliders_2D[i].off(Contact2DType.END_CONTACT,this.onTriggerExit2D,this);
                this.colliders_2D[i].off(Contact2DType.BEGIN_CONTACT,this.onCollisionEnter2D,this);
                this.colliders_2D[i].off(Contact2DType.END_CONTACT,this.onCollisionExit2D,this);
            }
        }

        if(this.colliders_3D)
        {
            for(let i = 0 ; i < this.colliders_3D.length ; i++)
            {
                this.colliders_3D[i].off("onTriggerEnter",this.onTriggerEnter,this);
                this.colliders_3D[i].off("onTriggerStay",this.onTriggerStay,this);
                this.colliders_3D[i].off("onTriggerExit",this.onTriggerExit,this);
                this.colliders_3D[i].off("onCollisionEnter",this.onCollisionEnter,this);
                this.colliders_3D[i].off("onCollisionStay",this.onCollisionStay,this);
                this.colliders_3D[i].off("onCollisionExit",this.onCollisionExit,this);
            }
        }
    }

    onDestroy()
    {
        this.removeAllColliderEventListener();
    }
}

//Behaviour.prototype.onLoad = function(){this.onLoad(); console.log("执行了behaviour的 onload")};