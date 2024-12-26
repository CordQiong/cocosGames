import { _decorator, Color, Component, Label, math, Node, random, randomRange, Size, Sprite, UITransform, Vec3 } from 'cc';
import Utils from '../Common/Utils';
import { QuadTreeRect } from '../Common/QuadTree';
const { ccclass, property } = _decorator;

@ccclass('GameElement')
export class GameElement extends Component {
    public get rect(): QuadTreeRect{
        return new QuadTreeRect(this.x, this.y, this.width, this.height);
    }

    private _x: number;
    public get x(): number {
        return this._x;
    }
    public set x(value: number) {
        this._x = value;
    }
    private _y: number;
    public get y(): number {
        return this._y;
    }
    public set y(value: number) {
        this._y = value;
    }
    private _width: number;
    public get width(): number {
        return this._width;
    }
    public set width(value: number) {
        this._width = value;
    }
    private _height: number;
    public get height(): number {
        return this._height;
    }
    public set height(value: number) {
        this._height = value;
    }

    public size: Size;
    protected dir: Vec3;
    
    public speed: number = 250;
    
    protected nameLabel: Label;

    private myself: boolean = false;

    protected onLoad(): void {
        this.nameLabel = this.node.getChildByName("nameLable").getComponent(Label);
        if (this.nameLabel) {
            this.nameLabel.string = this.node.name;
        }
    }

    start() {
        const uiTransform: UITransform = this.getComponent(UITransform);
        this.width = uiTransform.width;
        this.height = uiTransform.height;
        // this.size = math.size(this.width, this.height);
    }

    update(deltaTime: number) {
        this.UpdatePoint();
        // return
        if (this.myself) {
            return;
        }
        const v: Vec3 = this.dir.clone().multiplyScalar(this.speed * deltaTime);
        const final: Vec3 = this.node.position.clone().add(v);
        if (final.x - this.width / 2 < -this.size.width / 2) {  // - this.width / 2
            this.dir.x = -this.dir.x;
        }
        if (final.x + this.width / 2 > this.size.width / 2) {  //+ this.width / 2
            this.dir.x = -this.dir.x;
        }
        if (final.y - this.height / 2 < -this.size.height / 2) { // - this.height / 2
            this.dir.y = -this.dir.y;
        }
        if (final.y + this.height / 2 > this.size.height / 2) { // + this.height / 2
            this.dir.y = -this.dir.y;
        }
        // const pos: Vec3 = this.node.position.clone();
        // this.node.position = this.node.position.clone().add(displacement);
        const newPs = this.node.position.clone().add(this.dir.clone().multiplyScalar(this.speed * deltaTime))
        this.node.setPosition(newPs);
    }

    private UpdatePoint():void {
        this.x = this.node.position.x;
        this.y = this.node.position.y;
    }

    public InitDir():void {
        this.dir = this.randomInsideUnitCircle(); //Random.insideUnitCircle.normalized;
    }

    public Init(size: Size,isMyself:boolean = false): void{
        
        this.UpdatePoint();
        this.InitDir();
        this.myself = isMyself;
        if (this.myself) {
            this.node.getComponent(Sprite).color = Color.BLACK;
        }
        // Width = Height = transform.localScale.x;
        this.width = this.node.getComponent(UITransform).width;
        this.height = this.node.getComponent(UITransform).height;
        this.size = size;
    }

    public randomInsideUnitCircle(): Vec3 {
        const angle = randomRange(1,360) * 2 * Math.PI; // 随机角度
        const radius = Math.sqrt(Math.random());  // 随机半径，平方根保证均匀分布
        let x: number = Math.cos(angle) * radius;
        let y: number = Math.sin(angle) * radius; 
        return math.v3(x, y, 0).normalize();
    }

    public Click(off: boolean) {
        const sprite: Sprite = this.node.getComponent(Sprite);
        sprite.color = off ? Color.RED : Color.WHITE;
    }
}


