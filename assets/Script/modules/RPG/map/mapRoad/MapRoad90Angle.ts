import {IMapRoad} from "db://assets/Script/modules/RPG/map/MapRoadUtils";
import RoadNode from "db://assets/Script/modules/RPG/map/RoadNode";
import {math, Vec2} from "cc";


export default class MapRoad90Angle implements IMapRoad {
    private _row:number;
    private _col:number;

    private _nodeWidth:number;
    private _nodeHeight:number;
    private _halfNodeWidth:number;
    private _halfNodeHeight:number;

    public constructor(row:number, col:number, nodeWidth:number, nodeHeight:number, _halfNodeWidth:number, _halfNodeHeight:number) {
        this._row = row;
        this._col = col;
        this._nodeWidth = nodeWidth;
        this._nodeHeight = nodeHeight;
        this._halfNodeHeight = _halfNodeHeight;
        this._halfNodeWidth = _halfNodeWidth;
    }


    getDerectByPixel(x: number, y: number) {
        const dx:number = Math.floor(x/ this._nodeWidth);
        const dy:number = Math.floor(y/ this._nodeHeight);
        return math.v2(dx,dy);
    }

    getDerectByWorldPoint(cx: number, cy: number) {
        return math.v2(cx,cy);
    }

    getNodeByDerect(dx: number, dy: number): RoadNode {
        const  fPoint:Vec2 = this.getPixelByDerect(dx,dy);
        const  wPoint:Vec2 = this.getWorldPointByPixel(fPoint.x,fPoint.y);
        const node:RoadNode = new RoadNode();
        node.cx = wPoint.x
        node.cy = wPoint.y;

        node.px = fPoint.x;
        node.py  = fPoint.y;
        node.dx = dx;
        node.dy = dy;
        return node;
    }

    getNodeByPixel(x: number, y: number): RoadNode {
        const wPoint:Vec2 = this.getWorldPointByPixel(x,y);
        const  fPoint:Vec2 = this.getPixelByWorldPoint(wPoint.x,wPoint.y);
        const  dPoint:Vec2 = this.getDerectByPixel(x,y);
        const node:RoadNode = new RoadNode();
        node.cx = wPoint.x
        node.cy = wPoint.y;

        node.px = fPoint.x;
        node.py  = fPoint.y;
        node.dx = dPoint.x;
        node.dy = dPoint.y;
        return node;
    }

    getNodeByWorldPoint(cx: number, cy: number): RoadNode {
        var point:Vec2 = this.getPixelByWorldPoint(cx,cy)
        return this.getNodeByPixel(point.x,point.y);
    }

    getPixelByDerect(dx: number, dy: number) {
        const x:number  = Math.floor((dx+1)*this._nodeWidth- this._halfNodeWidth);
        const y:number = Math.floor((dy+1)*this._nodeHeight-this._halfNodeHeight);
        return math.v2(x,y);
    }

    getPixelByWorldPoint(cx: number, cy: number) {
        return this.getPixelByDerect(cx,cy);
    }

    getWorldPointByPixel(x: number, y: number) {
       return this.getDerectByPixel(x,y);
    }

}