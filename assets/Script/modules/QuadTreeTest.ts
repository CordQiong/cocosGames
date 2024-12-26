import { _decorator, Color, Component, EventKeyboard, EventTouch, Graphics, input, Input, instantiate, KeyCode, math, Node, NodeEventType, Prefab, Size, Vec3, view } from 'cc';
import { QuadTree, QuadTreeRect } from '../Common/QuadTree';
import { GameElement } from './GameElement';
const { ccclass, property } = _decorator;

@ccclass('QuadTreeTest')
export class QuadTreeTest extends Component {

    @property(Prefab)
    public elementPrefab: Prefab;

    private quadTree: QuadTree<GameElement> = null;
    private size: Size;

    public eleList = new Array<GameElement>();
    public  IsShow:boolean = true;
    public qtList: Array<QuadTree<GameElement>>;
    public clickList: Array<GameElement>;

    private idIndex: number = 0;

    @property(GameElement)
    public myElement: GameElement;

    @property(Graphics)
    public graphics: Graphics;

    private radius: number = 200;
    private count: number = 20;

    protected onLoad(): void {
        // this.graphics = this.getComponent(Graphics);
        this.size = view.getViewportRect();
        const rect: QuadTreeRect = new QuadTreeRect(0, 0, this.size.width, this.size.height);
        this.quadTree = new QuadTree(rect);

        this.eleList = [];
        this.qtList = [];
        this.clickList = [];

        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this)

        this.myElement = this.CreateElemnt(null,true);

        // this.CreateElemnt(math.v3(100, 100, 0))
        
        this.node.on(NodeEventType.MOUSE_DOWN, this.onMouseDown, this);

       
        // for (let i: number = 0; i < this.count; i++){
        //     const angle: number = (2 * Math.PI / this.count) * i;
        //     const x: number = this.myElement.node.position.x + this.radius * Math.cos(angle);
        //     const y: number = this.myElement.node.position.y + this.radius * Math.sin(angle);
        //     this.CreateElemnt(math.v3(x, y, 0));
        // }
        
    }

    private drawSize(): void { 
        this.graphics.clear();
        this.graphics.fillColor = Color.RED;
        this.graphics.strokeColor = Color.RED;
        this.graphics.lineWidth = 10
        this.graphics.rect(-this.size.width / 2, -this.size.height / 2, this.size.width, this.size.height);
        this.graphics.stroke();
    }

    private onMouseDown(event: EventTouch): void { 
        console.log("输出点击事件坐标",event.getLocationX(),event.getLocationY())
    }

    private onKeyDown(event: EventKeyboard): void { 
        switch (event.keyCode) {
            case KeyCode.ARROW_LEFT:
                for (let i: number = 0; i < 5000; i++) {
                    this.CreateElemnt();
                }
                break;
            case KeyCode.ARROW_RIGHT:
                for (let i: number = 0; i < 50; i++){
                    this.CreateElemnt();
                }
                break;
            case KeyCode.ARROW_UP:
                this.myElement = this.CreateElemnt();
                break;
        }
    }
    start() {
        this.drawSize();
    }

    update(deltaTime: number) {
        this.TreeUpdate();
    }


    // private void FixedUpdate() {

    // }

    private TreeUpdate(): void{
        // TreeRoot.Clear();
        this.quadTree.clear();
        this.qtList.length = 0;
        for (let i = 0; i < this.clickList.length; i++) {
            this.clickList[i].Click(false);
        }
        this.clickList.length = 0;

        for (let index = 0; index < this.eleList.length; index++) {
            const element = this.eleList[index];
            this.quadTree.insert(element);
            
        }

        if (this.myElement) {
            this.clickList = this.quadTree.query(this.myElement.rect);
            for (let i = 0; i < this.clickList.length; i++) {
                this.clickList[i].Click(true);
            }
        }

        if (this.IsShow) {
            let qtList: QuadTree<GameElement>[] = [];
            this.quadTree.getAllChildNodes(qtList)
            const rects = qtList.map(e => {
                return e.rect;
            }, this);
            this.drawRect(rects);
            // for (let i = 0; i < qtList.length; ++i) {
             

            //     this.drawRect(qtList[i].rect);
            // }
        }

    }


    private drawRect(rect:QuadTreeRect[]): void {
        // this.drawSize();
        this.graphics.clear();

        for (let index = 0; index < rect.length; index++) {
            const element = rect[index];
            this.graphics.fillColor = Color.RED;
            this.graphics.strokeColor = Color.YELLOW;
            this.graphics.lineWidth = 5;
            const x: number = element.x - element.width / 2;
            const y: number = element.y - element.height / 2;
            

            this.graphics.circle(element.x, element.y, 10);
            this.graphics.fill();

            this.graphics.rect(x, y, element.width, element.height);
            this.graphics.stroke();
        }
        



    }

    public CreateElemnt(pos?:Vec3,isMyself:boolean = false): GameElement {
        const node: Node = instantiate(this.elementPrefab);
        const gameElement: GameElement = node.getComponent(GameElement);
        node.name = `Ele ${this.idIndex++}`;
        gameElement.Init(this.size,isMyself);
        if (!pos) {
            pos = math.v3(0, 0, 0);
        }
        node.setPosition(pos);
        node.parent = this.node;
        if (!isMyself) {
            this.eleList.push(gameElement);
        }
        return gameElement;
    }
}


