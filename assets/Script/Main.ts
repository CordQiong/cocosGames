import { _decorator, Button, Component, EventKeyboard, input, Input, KeyCode, Label, math, Node, Vec2 } from 'cc';
import { ItemColor } from './enum';
import { config } from './config';
import { Render } from './Render';
const { ccclass, property } = _decorator;

export interface CurrentShapeData {
    /** 指向当前形状中心 */
    center: Vec2,
    /** 当前形状翻转下标，0-3，可以翻转 4 种形态 */
    index: number,
    /** 什么颜色的方块 */
    color: ItemColor
}

@ccclass('Main')
export class Main extends Component {

    @property(Node)
    startPanel: Node = undefined;

    @property(Node)
    endPanel: Node = undefined;

    /** 二维数组 */
    dataArray: ItemColor[][] = []

    eliminateVec2s: Vec2[] = [];

    /** 当前形状 */
    currentShape: CurrentShapeData = {
        center: math.v2(0, 0),
        index: 0,
        color: ItemColor.NULL
    }

    /** 计时变量 */
    time: number = 0

    /** 游戏进行开关 */
    isOpen: boolean = false

    score: number = 0;

    scoreLabel: Label;



    private startBtn: Node;
    private pauseBtn: Node;
    private restartBtn: Node;

    private _isPause: boolean = false;

    private findChild(name: string, startNode?: Node): Node {
        startNode = startNode ? startNode : this.node;
        let childs: Node[] = startNode.children;
        for (let index = 0; index < childs.length; index++) {
            const element: Node = childs[index];
            if (element.name == name) {
                return element;
            }
            let result: Node = this.findChild(name, element);
            if (result != null) {
                return result;
            }
        }
        return null;
    }

    protected onLoad(): void {

        const cBlockWidth: number = Math.floor(config.sceneWidth / config.col);
        const cBlockHight: number = Math.floor(config.sceneHeight / config.row);
        config.blockWidth = config.blockHeight = Math.min(cBlockHight, cBlockWidth);

        this.pauseBtn = this.findChild("pause");
        this.restartBtn = this.findChild("restartBtn");
        this.startBtn = this.findChild("startBtn");

        const labelNode = this.findChild("score");
        if (labelNode) {
            this.scoreLabel = labelNode.getComponent(Label);
        }
        this.eliminateVec2s = [];

        this.showEndPanel(false);
        this.updateScore();
        this.pauseBtn.on(Button.EventType.CLICK, this.onClickPause, this);
        this.restartBtn.on(Button.EventType.CLICK, this.onClickRestart, this);

        // this.node.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this)

        this.startBtn.on(Button.EventType.CLICK, this.gameStart, this);

    }

    private showEndPanel(v: boolean, isPause?: boolean): void {
        if (this.endPanel) {
            this.endPanel.active = v;
        }
        this._isPause = !!isPause;
    }

    private updateScore(): void {
        if (this.scoreLabel) {
            this.scoreLabel.string = `${this.score}`;
        }
    }

    private onKeyDown(event: EventKeyboard): void {
        if (!this.isOpen) {
            console.warn("游戏未开始")
            return;
        }
        switch (event.keyCode) {
            case KeyCode.ARROW_LEFT:
                this.changeCurrentShapePos(math.v2(0, -1))
                break;
            case KeyCode.ARROW_RIGHT:
                this.changeCurrentShapePos(math.v2(0, 1))
                break;
            case KeyCode.ARROW_DOWN:
                // 添加快速下落
                // this.changeCurrentShapePos(math.v2(1, 0))
                this.fastDown();
                break;
            case KeyCode.ARROW_UP:
                this.changeCurrentShapeIndex()
                break;

            default:
                break;
        }
    }

    private onClickPause(): void {
        this.isOpen = false;
        this.showEndPanel(true, true);
    }

    private onClickRestart(): void {
        if (this._isPause) {

            this.isOpen = true;
            this.showEndPanel(false, false);
        } else {
            this.gameStart();
            this.showEndPanel(false, false);
        }
    }


    start() {
        // this.gameStart();
    }

    gameStart(): void {
        if (this.isOpen) {
            console.warn("游戏正在运行中！！！");
            return;
        }
        if (this.startPanel) {
            this.startPanel.active = false;
        }
        this.getComponent(Render).init();
        this.initData();
        this.render();
        this.randomOneShape();
        this.isOpen = true
    }

    initData(): void {
        this.dataArray = [];
        for (let i = 0; i < config.row; i++) {
            this.dataArray[i] = [];
            for (let j = 0; j < config.col; j++) {
                this.dataArray[i][j] = ItemColor.NULL;
            }

        }
    }

    public getRandom(min: number, max: number): number {
        return Math.floor(min + max * Math.random());
    }

    /** 操作变形逻辑 */
    changeCurrentShapeIndex() {
        this.clearCurrentData(this.currentShape)
        this.currentShape.index += this.currentShape.index === 3 ? -3 : 1
        if (this.checkCurrentShapeData(this.currentShape)) {
            this.setCurrentData(this.currentShape)
            // cc.find(NodeUrl.Music).emit(MusicEvent.ACTION)
        } else {
            console.warn('操作不合理')
            this.currentShape.index += this.currentShape.index === 0 ? 3 : -1
        }
    }

    /** 操作逻辑 */
    changeCurrentShapePos(v: Vec2) {
        this.clearCurrentData(this.currentShape)
        this.currentShape.center.x += v.x
        this.currentShape.center.y += v.y
        if (this.checkCurrentShapeData(this.currentShape)) {
            this.setCurrentData(this.currentShape)
        } else {
            console.warn('操作不合理')
            this.currentShape.center.x -= v.x
            this.currentShape.center.y -= v.y
        }
    }

    async fastDown() {
        this.clearCurrentData(this.currentShape);
        for (let i = this.currentShape.center.x; i < config.row; i++) {
            this.currentShape.center.x = i;
            if (this.checkCurrentShapeData(this.currentShape)) {
                // this.setCurrentData(this.currentShape);
            } else {
                console.warn("无法移动。下一个");
                this.currentShape.center.x = i - 1;
                this.setCurrentData(this.currentShape);
                await this.checkLines();
                this.randomOneShape();
                break;
            }
        }
        // this.printDataArray();

    }

    private getCurrentShapeIndexData(currentShape: CurrentShapeData): Vec2[] {
        const { color, index } = currentShape;
        const shape = `shape${color}`;
        const shapeData: Vec2[][] = config[shape];
        if (!shapeData) {
            return [];
        }
        const shapeDatas: Vec2[] = shapeData[index];
        return shapeDatas || [];
    }

    randomOneShape(): void {
        this.currentShape.center.set(config.startPos);
        this.currentShape.color = this.getRandom(1, 7);
        this.currentShape.index = Math.floor(4 * Math.random());
        if (this.checkCurrentShapeData(this.currentShape)) {
            this.setCurrentData(this.currentShape);
        } else {
            this.isOpen = false;
            this.setCurrentData(this.currentShape)
            // cc.find(NodeUrl.Music).emit(MusicEvent.GAME_OVER)
            this.scheduleOnce(() => {
                // 显示游戏开始菜单
                this.showEndPanel(true, false);
            }, 2)
        }
    }

    setCurrentData(currentShape: CurrentShapeData): void {
        const { center, color } = currentShape;
        const shapeDatas: Vec2[] = this.getCurrentShapeIndexData(currentShape);
        for (let i = 0; i < shapeDatas.length; i++) {
            const ele = shapeDatas[i];
            const row: number = center.x + ele.x;
            const col: number = center.y + ele.y;
            this.dataArray[row][col] = color;
        }
        this.render();
    }

    /** 根据当前中心点和形状类型清除数据 */
    clearCurrentData(currentShape: CurrentShapeData) {
        const { center, color, index } = currentShape
        const shape = `shape${color}`
        const shapeData: Vec2[][] = config[shape];
        const datas: Vec2[] = shapeData[index];
        for (let i = 0; i < datas.length; i++) {
            const ele = datas[i];
            const row = center.x + ele.x
            const col = center.y + ele.y
            this.dataArray[row][col] = ItemColor.NULL
        }
    }

    render(): void {
        const render: Render = this.getComponent(Render);
        if (render) {
            render.render(this.dataArray);
        }
    }

    checkCurrentShapeData(currentShape: CurrentShapeData): boolean {
        const { center } = currentShape;
        const shapeIndexDatas: Vec2[] = this.getCurrentShapeIndexData(currentShape);
        for (let i = 0; i < shapeIndexDatas.length; i++) {
            const v2: Vec2 = shapeIndexDatas[i];
            const row: number = center.x + v2.x;
            if (row < 0 || row >= config.row) {
                return false;
            }
            const col = center.y + v2.y;
            if (col < 0 || col >= config.col) {
                return false;
            }
            if (this.dataArray[row][col] !== ItemColor.NULL) {
                return false;
            }
        }
        return true;
    }

    async autoDown() {
        this.clearCurrentData(this.currentShape);
        this.currentShape.center.x += 1;
        if (this.checkCurrentShapeData(this.currentShape)) {
            this.setCurrentData(this.currentShape);
        } else {
            console.warn("无法移动。下一个");
            this.currentShape.center.x -= 1;
            this.setCurrentData(this.currentShape);
            await this.checkLines();
            this.randomOneShape();
        }
    }

    async checkLines() {
        let row: number = config.row - 1;
        let isEliminated: boolean = false;
        this.eliminateVec2s = [];
        while (row !== 0) {
            let isFull: boolean = true;
            for (let i = 0; i < config.col; i++) {
                if (this.dataArray[row][i] === ItemColor.NULL) {
                    isFull = false;
                }
            }
            if (isFull) {

                for (let i = 0; i < config.col; i++) {
                    this.eliminateVec2s.push(math.v2(row, i));
                }

                isEliminated = true;
                for (let p = row; p > 0; p--) {
                    for (let j = 0; j < config.col; j++) {
                        this.dataArray[p][j] = this.dataArray[p - 1][j];
                    }
                }
                this.score += 1;
            } else {
                row--;
            }
        }

        const render: Render = this.getComponent(Render);
        if (render && this.eliminateVec2s.length > 0) {
            render.playEliminateEff(this.eliminateVec2s).then(() => {
                this.updateScore();
            });
        } else {
            this.updateScore();
        }
    }


    update(deltaTime: number) {
        if (!this.isOpen) {
            return
        }
        this.time += deltaTime
        if (this.time > 1) {
            this.time = 0
            // 下落逻辑
            this.autoDown()
        }
    }

    private printDataArray(): void {
        let str: string = "";
        for (let i = 0; i < this.dataArray.length; i++) {
            const cols: number[] = this.dataArray[i];
            str += cols.join(",") + "\n";
            // for (let j = 0; j < cols.length; j++) {
            //     const v = cols[j];

            // }

        }
        console.log(str);
    }
}


