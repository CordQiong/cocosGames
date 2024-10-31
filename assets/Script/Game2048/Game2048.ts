import { _decorator, Component, math, Node, Vec2, Vertex } from 'cc';
import { Grid } from './Grid';
import { DirectionType } from './Game2048Enum';
import { Tile } from './Tile';
import { TouchEvent } from '../Common/Enum';
const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game2048 extends Component {

    public static _ins: Game2048;

    protected onLoad(): void {
        Game2048._ins = this;

        this.node.on(TouchEvent.UP, () => {
            this.move(DirectionType.UP)
        }, this);

        this.node.on(TouchEvent.RIGHT, () => {
            this.move(DirectionType.RIGHT)
        }, this);

        this.node.on(TouchEvent.DOWN, () => {
            this.move(DirectionType.DOWN);
        }, this);
        this.node.on(TouchEvent.LEFT, () => {
            this.move(DirectionType.LEFT);
        }, this);
    }

    private grid: Grid;

    private startTiles: number = 2;

    private readonly size: number = 4;
    start() {
        this.grid = this.node.addComponent(Grid);
        this.grid.setup(this.size);

        this.addStartTiles();

        // console.log(this.serialize());
        this.grid.printGrid();
    }

    update(deltaTime: number) {

    }

    private getVector(direction: DirectionType): Vec2 {
        const map = {
            [DirectionType.UP]: math.v2(0, -1),
            [DirectionType.DOWN]: math.v2(0, 1),
            [DirectionType.RIGHT]: math.v2(1, 0),
            [DirectionType.LEFT]: math.v2(-1, 0)
        }
        return map[direction]
    }

    private buildTraversals(vector: Vec2): { x: number[], y: number[] } {
        const traversals: { x: number[], y: number[] } = { x: [], y: [] };
        for (let pos = 0; pos < this.size; pos++) {
            traversals.x.push(pos);
            traversals.y.push(pos);
        }
        if (vector.x == 1) {
            traversals.x = traversals.x.reverse();
        }
        if (vector.y == 1) {
            traversals.y = traversals.y.reverse();
        }
        return traversals;
    }

    private findFarthestPoint(cell: Vec2, vector: Vec2): { farthest: Vec2, next: Vec2 } {
        let previous: Vec2;

        do {
            previous = cell;
            cell.set(previous.x + vector.x, previous.y + vector.y);
        } while (this.grid.withinBounds(cell) && this.grid.checkCellAvailable(cell));

        return {
            farthest: previous,
            next: cell
        }
    }

    private prepareTiles(): void {
        this.grid.foreachCell((x: number, y: number, tile: Node) => {
            if (tile) {
                const tileSp: Tile = tile.getComponent(Tile);
                tileSp.megreFrom = null;
                tileSp.savePosition();
            }
        })
    }

    private moveTile(tile: Node, cell: Vec2): void {
        this.grid.removeTile(tile);
        this.grid.insertTile(tile, cell);
    }

    private addStartTiles(): void {
        for (let i = 0; i < this.startTiles; i++) {
            // this.addRandomTile();
            if (this.grid.checkCellsAvailable()) {
                const value: number = Math.random() < 0.9 ? 2 : 4;
                const tile = this.createTile(math.v2(0, i), value);
                this.grid.insertTile(tile);
            }

        }


    }

    private addRandomTile(): void {
        if (this.grid.checkCellsAvailable()) {
            const value: number = Math.random() < 0.9 ? 2 : 4;
            const tile = this.createTile(this.grid.randomAvailableCell(), value);
            this.grid.insertTile(tile);
        }
    }

    private nextPos(vector: Vec2, direction: DirectionType): { pos: Vec2, value: number } {
        const map = {
            [DirectionType.UP]: (v: Vec2) => { return math.v2(v.x + 1, v.y) },
            [DirectionType.DOWN]: (v: Vec2) => { return math.v2(v.x - 1, v.y) },
            [DirectionType.LEFT]: (v: Vec2) => { return math.v2(v.x, v.y + 1) },
            [DirectionType.RIGHT]: (v: Vec2) => { return math.v2(v.x, v.y - 1) }
        }
        const pos: Vec2 = map[direction](vector);
        if (this.grid.withinBounds(pos)) {
            const value: number = this.grid.getCellValue(pos);
            return { pos: pos, value: value }
        }
        return null;
    }

    private nextNonZore(cellPos: Vec2, direction: DirectionType): { pos: Vec2, value: number } {
        const nextPos = this.nextPos(cellPos, direction);
        if (!nextPos) {
            return null;
        }
        const { pos, value } = nextPos;
        if (!this.grid.withinBounds(pos)) {
            return null;
        }
        if (value == 0) {
            return this.nextNonZore(pos, direction);
        }
        return nextPos;
    }

    private cale(cellPos: Vec2, direction: DirectionType): void {
        const cellValue: number = this.grid.getCellValue(cellPos);
        const next = this.nextNonZore(cellPos, direction);
        if (!next) {
            return;
        }
        const cellNode: Node = this.grid.getCellContent(cellPos);
        const { pos, value } = next;
        let nextNode: Node = this.grid.getCellContent(pos);
        if (cellValue == 0) {
            this.grid.cells[pos.x][pos.y] = cellNode;
            this.grid.cells[cellPos.x][cellPos.y] = nextNode;
            this.cale(cellPos, direction);
        } else if (cellValue === value) {
            const mergedNode: Node = this.createTile(pos, value * 2);
            this.grid.cells[pos.x][pos.y] = null;
            this.grid.cells[cellPos.x][cellPos.y] = mergedNode;
        }
        const nextPos = this.nextPos(cellPos, direction);
        this.cale(nextPos.pos, direction)
    }

    public move(direction: DirectionType): void {

        if (direction == DirectionType.UP) {
            for (let i = 0; i < this.size; i++) {
                this.cale(math.v2(0, i), direction);
            }
        } else if (direction == DirectionType.DOWN) {
            for (let i = 0; i < this.size; i++) {
                this.cale(math.v2(this.size - 1, i), direction);
            }
        } else if (direction == DirectionType.LEFT) {
            for (let i = 0; i < this.size; i++) {
                this.cale(math.v2(i, 0), direction);
            }
        } else if (direction == DirectionType.RIGHT) {
            for (let i = 0; i < this.size; i++) {
                this.cale(math.v2(i, this.size - 1), direction);
            }
        }

        this.addRandomTile();
        this.grid.printGrid();
        // const vector: Vec2 = this.getVector(direction);
        // const traversals = this.buildTraversals(vector);

        // let cell: Vec2 = new Vec2(0, 0);
        // let tile: Node = null;
        // let moved: boolean = false;
        // this.prepareTiles();


        // for (let i = 0; i < traversals.x.length; i++) {
        //     const x: number = traversals.x[i];
        //     for (let j = 0; j < traversals.y.length; j++) {
        //         const y: number = traversals.y[j];
        //         cell.set(x, y);
        //         tile = this.grid.getCellContent(cell);
        //         if (tile) {
        //             const tileSp: Tile = tile.getComponent(Tile);
        //             const positions = this.findFarthestPoint(cell, vector);
        //             const nextTile: Node = this.grid.getCellContent(positions.next);
        //             const nextTileSp: Tile = nextTile && nextTile.getComponent(Tile);
        //             if (nextTile && nextTileSp && nextTileSp.value === tileSp.value && !nextTileSp.megreFrom) {
        //                 let merged = this.createTile(positions.next, tileSp.value * 2);
        //                 let mergedTile: Tile = merged.getComponent(Tile);
        //                 mergedTile.megreFrom = [tile, nextTile];

        //                 this.grid.insertTile(merged);
        //                 this.grid.removeTile(tile);

        //                 tileSp.updatePosition(positions.next);
        //             } else {
        //                 this.moveTile(tile, positions.farthest)
        //             }

        //             if (!this.positionsEqual(cell, math.v2(tileSp.positionX, tileSp.positionY))) {
        //                 moved = true;
        //             }
        //         }
        //     }
        // }


        // // if (moved) {
        // //     this.serialize();
        // // }

        // console.log(this.serialize());
    }



    private positionsEqual(first: Vec2, second: Vec2): boolean {
        return first.x === second.x && first.y === second.y;
    }

    private createTile(pos: Vec2, value: number): Node {
        const node: Node = new Node();
        const tile: Tile = node.addComponent(Tile);
        tile.setup(pos, value);
        return node;
    }

    public serialize(): any {
        return {
            grid: this.grid.serialize()
        }
    }
}
window["Game2048"] = Game2048


