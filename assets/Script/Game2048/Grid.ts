import { _decorator, Component, math, Node, Vec2 } from 'cc';
import { Tile } from './Tile';
const { ccclass, property } = _decorator;

@ccclass('Grid')
export class Grid extends Component {
    private cells: Node[];


    private size: number;

    public setup(size: number): void {
        this.size = size;
    }


    /**
     * 获取一个空的棋盘
     * @returns 
     */
    public empty(): Node[] {
        let cells = [];
        for (let x = 0; x < this.size; x++) {
            const row = cells[x] = [];
            for (let y = 0; y < this.size; y++) {
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

    /**
     * 插入一个格子块
     * @param tile 
     */
    public insertTile(tile: Tile): void {
        this.cells[tile.positionX][tile.positionY] = tile;
    }

    /**
     * 移除一个格子块
     * @param tile 
     */
    public removeTile(tile: Tile): void {
        this.cells[tile.positionX][tile.positionY] = null;
    }

    /**
     * 根据坐标获取格子内容
     * @param vector 
     * @returns 
     */
    public getCellContent(vector: Vec2): Node {
        if (this.withinBounds(vector)) {
            return this.cells[vector.x][vector.y];
        }
        return null;
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
                const node: Node = this.cells[x][y];
                if (node) {
                    row.push(node.getComponent(Tile).serialize());
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

    onLoad(): void {
        this.cells = [];
    }

    start() {

    }

    update(deltaTime: number) {

    }
}


