import { Constraint, math, Vec2 } from "cc";
import { IMapRoad } from "../MapRoadUtils";
import RoadNode from "../RoadNode";

export default class MapRoad45Angle implements IMapRoad{

    private _row: number;
    private _col: number;
    private _nodeWidth: number;
    private _nodeHeight: number;
    private _halfNodeWidth: number;
    private _halfNodeHeight: number;

    public constructor(row: number, col: number, nodeWidth: number, nodeHeight: number, halfNodeWidth: number, halfNodeHeight: number) {
        this._row = row;
        this._col = col;
        this._nodeWidth = nodeWidth;
        this._nodeHeight = nodeHeight;
        this._halfNodeWidth = halfNodeWidth;
        this._halfNodeHeight = halfNodeHeight;
    }

    getNodeByPixel(x: number, y: number): RoadNode {
        const wPoint: Vec2 = this.getWorldPointByPixel(x, y);
        const fPoint: Vec2 = this.getPixelByWorldPoint(wPoint.x, wPoint.y);
        const dPoint: Vec2 = this.getDerectByPixel(x, y);

        const node: RoadNode = new RoadNode();
        node.cx = wPoint.x;
        node.cy = wPoint.y;

        node.px = fPoint.x;
        node.py = fPoint.y;
        
        node.dx = dPoint.x;
        node.dy = dPoint.y;

        return node;

    }
    getNodeByDerect(dx: number, dy: number): RoadNode {
        var fPoint: Vec2 = this.getPixelByDerect(dx, dy);
        var wPoint: Vec2 = this.getWorldPointByPixel(fPoint.x, fPoint.y);

        var node: RoadNode = new RoadNode();

        node.cx = wPoint.x;
        node.cy = wPoint.y;

        node.px = fPoint.x;
        node.py = fPoint.y;

        node.dx = dx;
        node.dy = dy;

        return node;
    }
    getNodeByWorldPoint(cx: number, cy: number): RoadNode {
        const point: Vec2 = this.getPixelByWorldPoint(cx, cy)
        return this.getNodeByPixel(point.x, point.y);
    }
    /**
     * 根据像素坐标得到场景世界坐标
     * @param x 
     * @param y 
     */
    getWorldPointByPixel(x: number, y: number): math.Vec2 {
        const cx: number = Math.ceil(x / this._nodeWidth - 0.5 + y / this._nodeHeight) - 1;
        const cy: number = (this._col - 1) - Math.ceil(x / this._nodeWidth - 0.5 - y / this._nodeHeight);
        return math.v2(cx, cy);
    }
    /**
     * 根据世界坐标获取像素坐标
     * @param cx 
     * @param cy 
     */
    getPixelByWorldPoint(cx: number, cy: number): math.Vec2 {
        const x: number = Math.floor((cx + 1 - (cy - (this._col - 1))) * this._halfNodeWidth);
        const y: number = Math.floor((cx + 1 + (cy - (this._col - 1))) * this._halfNodeHeight);
        return math.v2(x, y);
    }
    getDerectByPixel(x: number, y: number): math.Vec2 {
        const worldPoint: Vec2 = this.getWorldPointByPixel(x, y);
        const pixelPoint: Vec2 = this.getPixelByWorldPoint(worldPoint.x, worldPoint.y);
        const dx: number = Math.floor(pixelPoint.x / this._nodeWidth) - (pixelPoint.x % this._nodeWidth == 0 ? 1 : 0);
        const dy: number = Math.floor(pixelPoint.y / this._halfNodeHeight) - 1;
        return math.v2(dx, dy);
    }
    getDerectByWorldPoint(cx: number, cy: number): math.Vec2 {
        var dx: number = Math.floor((cx - (cy - (this._col - 1))) / 2);
        var dy: number = cx + (cy - (this._col - 1));
        return math.v2(dx, dy);
    }
    getPixelByDerect(dx: number, dy: number): math.Vec2 {
        const x: number = Math.floor((dx + dy % 2) * this._nodeWidth + (1 - dy % 2) * this._halfNodeWidth);
        const y: number = Math.floor((dy + 1) * this._halfNodeHeight);
        return math.v2(x, y);   
    }
    
}