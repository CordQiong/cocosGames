
import { Node, Component, _decorator, Label, Vec3, sp, math, view, Vec2} from "cc";
import { Behaviour } from "../Behaviour";
import RoadNode from "../map/RoadNode";
import PathFindingAgent from "../map/PathFindingAgent";
const { ccclass, property } = _decorator;

/**
 * 角色状态
 */
export enum CharacterState
{
    /**
     * 待机
     */
    idle = 0,

    /**
     * 行走
     */
    walk = 1,

    /**
     * 坐下
     */
    sitdown = 2,

    sitdown_walk = 3,
}

/**
 * 场景角色基类 
 * @author 
 * 
 */

@ccclass('Character')
export default class Character extends Behaviour {

    /**
     * 单位名字文本
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

    private _skeleton:sp.Skeleton = null;

    public get skeleton(): sp.Skeleton
    {
        if (!this._skeleton)
        {
            this._skeleton = this.node.getComponentInChildren(sp.Skeleton);
        }
        return this._skeleton;
    }

    /**
     * 设置单位方向
     * 
     * 方向值范围为 0-7，方向值设定如下，0是下，1是左下，2是左，3是左上，4是上，5是右上，6是右，7是右下
     * 
     *        4
     *      3   5
     *    2   *   6
     *      1   7
     *        0
     * 
     */
    private _direction:number = 0;
    public get direction():number
    {
        return this._direction;
    }

    public set direction(value:number)
    {
        this._direction = value;
        if (value == 2) {
            let scale: Vec3 = this.skeleton.node.scale.clone();
            let scaleX: number = scale.x;
            scale.x = -scaleX;
            this.skeleton.node.scale = scale;
            return;
        }
        let scale = this.skeleton.node.scale.clone();
        let scaleX: number = scale.x;
        scale.x = scaleX;
        this.skeleton.node.scale = scale;

        // if(value > 4)
        // {
        //     // this.skeleton.rowIndex = 4 - value % 4;
        //     let scale = this.skeleton.node.scale.clone();
        //     let scaleX: number = scale.x;
        //     scale.x = scaleX;
        //     this.skeleton.node.scale = scale;
        // }else
        // {
        //     // this.movieClip.rowIndex = value;
        //     let scale: Vec3 = this.skeleton.node.scale.clone();
        //     let scaleX: number = scale.x;
        //     scale.x = -scaleX;
        //     this.skeleton.node.scale = scale;
        // }
    }

    protected _state:CharacterState = 0;

    public get state():CharacterState
    {
        return this._state;
    }
    public set state(value:CharacterState)
    {
        // this._state = value;

        // var halfCol:number = this.movieClip.col / 2;

        // switch(this._state)
        // {
        //     case CharacterState.idle: 
        //         this.movieClip.begin = 0;
        //         this.movieClip.end = halfCol;
        //     break;

        //     case CharacterState.walk: 
        //         this.movieClip.begin = halfCol;
        //         this.movieClip.end = this.movieClip.col;
        //     break;
        // }
    }


    /**
     * 单位当前所站在的路点
     */
    public get roadNode():RoadNode
    {
        return PathFindingAgent.instance.getRoadNodeByPixel(this.node.position.x,this.node.position.y);
    }

    /**
     *角色最近一次所站在的地图节点 
     */		
    protected _lastRoadNode:RoadNode = null;

    /**
     *玩家当前所站在的地图节点 
     */		
    private _currentNode:RoadNode;

    //public isScrollScene:boolean = false;

    public moving:boolean = false;

    public moveSpeed:number = 200;

    private _moveAngle:number = 0;

    private _roadNodeArr: RoadNode[] = [];
    private _roadNodeVec2: Vec2[] = [];
    private _nodeIndex: number = 0;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}



    speedX: number = 100; // 水平速度，单位：像素/秒
    speedY: number = 100; // 垂直速度，单位：像素/秒
    private directionX: number = 1; // 水平方向，1为向右，-1为向左
    private directionY: number = 1; // 垂直方向，1为向上，-1为向下

    private screenWidth: number = 0; // 屏幕宽度
    private screenHeight: number = 0; // 屏幕高度

    onLoad(): void {
        super.onLoad();
        const visibleSize = view.getVisibleSize();
        this.screenWidth = visibleSize.width;
        this.screenHeight = visibleSize.height;
    }

    start () {

        this.state = CharacterState.idle; //默认待机状态

    }

    update (dt) 
    {
        if(this.moving)
        {

            var nextVec: Vec2 = this._roadNodeVec2[this._nodeIndex];

            let pos = this.node.position;

            let posX: number = pos.x;
            let posY: number = pos.y;


            var dx: number = nextVec.x - posX;
            var dy: number = nextVec.y - posY;

            var speed:number = this.moveSpeed * dt;

            if(dx * dx + dy * dy > speed * speed)
            {
                if(this._moveAngle == 0)
                {
                    this._moveAngle = Math.atan2(dy,dx);

                    var dire:number = Math.round((-this._moveAngle + Math.PI)/(Math.PI / 4));
                    this.direction = dire > 5 ? dire-6 : dire+2;
                }

                var xspeed:number = Math.cos(this._moveAngle) * speed;
                var yspeed:number = Math.sin(this._moveAngle) * speed;

                posX += xspeed;
                posY += yspeed;

            }else
            {
                this._moveAngle = 0;

                if(this._nodeIndex == this._roadNodeArr.length - 1)
                {
                    posX = nextVec.x;
                    posY = nextVec.y

                    this.stop();
                }else
                {
                    this.walk();
                }
            }

            // console.log("移动坐标", pos.x, pos.y);
            this.node.setPosition(posX,posY);
            // this.node.position = pos;
            // console.log("当前节点坐标", this.node.position.x, this.node.position.y);
            // this.node.setPosition(pos);
            // this.node.setPosition(pos.x, pos.y);
        }

        this.updateCharaterStateByNode();

    }

    // protected lateUpdate(dt: number): void {
    //     if (this.moving && this.movePos) { 
    //         this.node.position = this.movePos;
    //     }
    // }

    /**
     * 根据角色所在的路节点信息更新自身的信息
     * @returns 
     */
    public updateCharaterStateByNode():void
    {
        var roadNode:RoadNode = this.roadNode;
        
        if(roadNode == this._lastRoadNode)
        {
            //如果角色所站的路节点没有发生变化，不处理
            return;
        }
        
        this._lastRoadNode = roadNode
        
        if(this._lastRoadNode)
        {
            switch(this._lastRoadNode.value)
            {
                case 2://如果是透明节点时
                    if(this.alpha != 0.4)
                    {
                        this.alpha = 0.4;
                    }
                    break;
                case 3://如果是隐藏节点时
                    //this.alpha < 1 && (this.alpha = 1);
                    this.alpha > 0 && (this.alpha = 0);
                    break;
                default:
                    this.alpha < 1 && (this.alpha = 1);
                    
            }
            
        }

    }

    /**
     * 根据路节点路径行走
     * @param roadNodeArr 
     */
    public walkByRoad(roadNodeArr:RoadNode[])
    {
        this._roadNodeArr = roadNodeArr;
        const nodeVec2Array:Vec2[] = this._roadNodeArr.map(e => { 
            return math.v2(e.px, e.py);
        },this)
        this.wolkByVec2(nodeVec2Array);
    }

    public wolkByVec2(vec2Array: Vec2[]): void{
        this._roadNodeVec2 = vec2Array;
        this._nodeIndex = 0;
        this._moveAngle = 0;

        this.walk();
        this.move();
    }

    private walk()
    {
        if (this._nodeIndex < this._roadNodeVec2.length - 1)
        {
            this._nodeIndex ++;
        }else
        {

        }
    }

    public move()
    {
        this.moving = true;
        this.state = CharacterState.walk;
    }

    public stop()
    {
        this.moving = false;
        this.state = CharacterState.idle;
    }

    /**
     * 导航角色到目标点
     * @param targetX 
     * @param targetY 
     */
    public navTo(targetX:number,targetY:number)
    {
        // this.node.setPosition(targetX, targetY);
        var roadNodeArr: RoadNode[] = PathFindingAgent.instance.seekPath(math.v2(this.node.position.x, this.node.position.y), math.v2(targetX, targetY)); //如果目标点是障碍，则寻路失败                               //按需求自选
       // var roadNodeArr:RoadNode[] = PathFindingAgent.instance.seekPath2(this.node.position.x,this.node.position.y,targetX,targetY);  //如果目标点是障碍，则寻路到里目标点最近的一个非障碍点         //按需求自选

        if(roadNodeArr.length > 0)
        {
            console.log(roadNodeArr);
            this.walkByRoad(roadNodeArr);
        }
    }
}
