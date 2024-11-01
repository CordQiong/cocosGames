import { _decorator, Asset, assetManager, AssetManager, Component, error, instantiate, Label, math, Node, Prefab, resources, Sprite, SpriteAtlas, SpriteFrame, UITransform, utils, Vec2 } from 'cc';
import { Tile } from './Tile';
import { config2048 } from './Game2048Enum';
import AssetMgr from '../Common/AssetMgr';
const { ccclass, property } = _decorator;

@ccclass('Grid')
export class Grid extends Component {
    private cells: Tile[][];

    private cellNodeArray: Node[][];

    private size: number;


    public setup(size: number): void {
        this.size = size;
        this.cells = this.empty();
        // this.initNode()
    }

    public async initNode() {
        this.cellNodeArray = [];
        if (!this.cells || !this.cells.length) {
            return;
        }
        const height: number = config2048.size * config2048.tileHight;
        const width: number = config2048.size * config2048.tileWidth;
        for (let i = 0; i < this.cells.length; i++) {
            const row: Tile[] = this.cells[i];
            this.cellNodeArray[i] = [];
            for (let j = 0; j < row.length; j++) {
                const node: Node = await this.createNode(0);
                const x: number = - width / 2 + config2048.tileWidth / 2 + j * config2048.tileWidth;
                const y: number = height / 2 - config2048.tileHight / 2 - i * config2048.tileHight;
                node.setPosition(x, y);
                node.parent = this.node;
                this.cellNodeArray[i][j] = node;
            }
        }
    }


    /**
     * 获取一个空的棋盘
     * @returns 
     */
    public empty(): Tile[][] {

        let cells = [];
        for (let i = 0; i < this.size; i++) {
            const row = cells[i] = [];
            for (let j = 0; j < this.size; j++) {

                // tile.parent = this.node;
                row.push(null);
            }
        }
        return cells;
    }

    public randomAvailableCell(): Vec2 {
        const availableCells: Vec2[] = this.availableCells();
        if (availableCells.length) {
            return availableCells[Math.floor(Math.random() * availableCells.length)]
        }
        return null;
    }

    /**
     * 获取可用的格子坐标列表
     * @returns 
     */
    public availableCells(): Vec2[] {
        const cells: Vec2[] = [];
        this.foreachCell((x: number, y: number, tile: Node) => {
            if (!tile) {
                cells.push(math.v2(x, y));
            }
        })
        return cells;
    }

    /**
     * 遍历整个棋盘
     * @param callBack 
     */
    public foreachCell(callBack: Function): void {
        for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {
                if (callBack) {
                    callBack(x, y, this.cells[x][y]);
                }
            }

        }
    }

    /**
     * 检测格子是否是可用状态
     * @param vector 
     * @returns 
     */
    public checkCellAvailable(vector: Vec2): boolean {
        return !this.getCellContent(vector);
    }

    /**
     * 检测格子是否已经被占领
     * @param vector 
     * @returns 
     */
    public checkCellOccupied(vector: Vec2): boolean {
        return !!this.getCellContent(vector);
    }

    /**
     * 检测棋盘是否有可用格子
     * @returns 
     */
    public checkCellsAvailable(): boolean {
        return !!this.availableCells().length;
    }

    public insertTile(tile: Tile, pos?: Vec2): void;
    /**
     * 插入一个格子块
     * @param tile 
     */
    public insertTile(tile: Tile, pos?: Vec2): void {
        // const tp: Tile = tile.getComponent(Tile);
        const x: number = pos ? pos.x : tile.positionX;
        const y: number = pos ? pos.y : tile.positionY;
        this.cells[x][y] = tile;
    }

    public removeTile(tile: Tile, pos?: Vec2): void;
    /**
     * 移除一个格子块
     * @param tile 
     */
    public removeTile(tile: Tile, pos?: Vec2): void {
        if (!tile && !pos) {
            console.warn("移除格子时即没有传入格子对象也没有传位置。两个参数至少传一个");
            return;
        }
        const x: number = pos ? pos.x : tile.positionX;
        const y: number = pos ? pos.y : tile.positionY;
        this.cells[x][y] = null;
    }

    /**
     * 根据坐标获取格子内容
     * @param vector 
     * @returns 
     */
    public getCellContent(vector: Vec2): Tile {
        if (this.withinBounds(vector)) {
            return this.cells[vector.x][vector.y];
        }
        return null;
    }

    // public getCellTile(vector: Vec2): Tile {
    //     const node: Node = this.getCellContent(vector);
    //     if (!node) {
    //         return null;
    //     }
    //     return node.getComponent(Tile);
    // }

    /**
     * 获取格子值
     * @param vector 
     * @returns 
     */
    public getCellValue(vector: Vec2): number {
        const node: Tile = this.getCellContent(vector);
        if (!node) {
            return 0;
        }
        return node.value;
    }

    /**
     * 检查坐标是否在区间范围内
     * @param vector 
     * @returns 
     */
    public withinBounds(vector: Vec2): boolean {
        return vector.x >= 0 && vector.x < this.size && vector.y >= 0 && vector.y < this.size;
    }

    public serialize(): any {
        let cellState = [];
        for (var x = 0; x < this.size; x++) {
            var row = cellState[x] = [];
            for (var y = 0; y < this.size; y++) {
                const tile: Tile = this.cells[x][y];
                if (tile) {
                    row.push(tile.serialize());
                }
                else {
                    row.push(null);
                }
            }
        }
        return {
            size: this.size,
            cells: cellState
        };
    }

    public printGrid(): void {
        let str: string = "";
        for (var x = 0; x < this.size; x++) {
            const lineValues: number[] = [];
            for (var y = 0; y < this.size; y++) {
                const value: number = this.getCellValue(math.v2(x, y));
                lineValues.push(value);
            }
            str += lineValues.join(",") + "\n";
        }
        console.log(str);
    }

    public render(): void {
        for (let i = 0; i < this.cells.length; i++) {
            const cells: Tile[] = this.cells[i];
            for (let j = 0; j < cells.length; j++) {
                const node: Node = this.cellNodeArray[i][j];
                this.setNodeValue(node, this.getCellValue(math.v2(i, j)));
            }
        }
    }

    private async createNode(value: number): Promise<Node> {

        let path: string = "resources://prefabs/Title"
        const node: Node = await AssetMgr.instance.createPrefab(path)

        if (!node) {
            return null;
        }
        const lableNode = node.getChildByName("Label");
        if (lableNode) {
            lableNode.getComponent(Label).string = `${value}`;
        }
        const spNode = node.getChildByName("Ghost");
        if (spNode) {
            const sp = spNode.getComponent(Sprite);
            sp.sizeMode = Sprite.SizeMode.CUSTOM;
            sp.getComponent(UITransform).setContentSize(config2048.tileWidth, config2048.tileHight);
        }
        return node;
    }

    public setNodeValue(node: Node, value: number): void {
        if (!node) {
            return;
        }
        const lableNode = node.getChildByName("Label");
        if (lableNode) {
            lableNode.getComponent(Label).string = value > 0 ? `${value}` : "";
        }

    }

    onLoad(): void {
        this.cells = [];
    }

    start() {

    }

    update(deltaTime: number) {

    }
}


