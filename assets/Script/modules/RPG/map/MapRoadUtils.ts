import { math, Vec2 } from "cc";
import { MapType } from "../Enum";
import RoadNode from "./RoadNode";
import MapRoad45Angle from "./mapRoad/MapRoad45Angle";

export default class MapRoadUtils {
    private static _instance: MapRoadUtils;
    public static get instance(): MapRoadUtils{
        if (!this._instance) {
            this._instance = new MapRoadUtils();
        }
        return this._instance;
    }

    private _mapWidth: number;
    
    private _mapHeight: number;
    
    private _nodeWidth: number;
   
    private _nodeHeight: number;
   

    private _halfNodeWidth: number;
    
    private _halfNodeHeight: number;
    

    private _col: number;
   
    private _row: number;
  

    private _mapType: MapType;
    

    private _mapRoad: IMapRoad;

    public updateMapInfo(mapWidth: number, mapHeight: number, nodeWidth: number, nodeHeight: number,mapType:MapType): void{
        this._mapWidth = mapWidth;
        this._mapHeight = mapHeight;
        this._nodeWidth = nodeWidth;
        this._nodeHeight = nodeHeight;

        this._halfNodeWidth = Math.floor(nodeWidth / 2);
        this._halfNodeHeight = Math.floor(nodeHeight / 2);

        this._mapType = mapType;

        switch (this._mapType) {
            case MapType.Angle45:
                this._col = Math.ceil(mapWidth / nodeWidth);
                this._row = Math.ceil(mapHeight / nodeHeight) * 2;
                this._mapRoad = new MapRoad45Angle(this._row, this._col, this._nodeWidth, this._nodeHeight, this._halfNodeWidth, this._halfNodeHeight);
                break;
        
            default:
                break;
        }
    }

    public getNodeByPixel(x: number, y: number): RoadNode{
        if (this._mapRoad) {
            return this._mapRoad.getNodeByPixel(x, y);
        }
        return new RoadNode();
    }

    public getNodeByDerect(dx: number, dy: number): RoadNode{
        if (this._mapRoad) {
            return this._mapRoad.getNodeByDerect(dx, dy);
        }
        return new RoadNode();
    }

    public getNodeByWorldPoint(cx: number, cy: number): RoadNode{
        if (this._mapRoad) {
            return this._mapRoad.getNodeByWorldPoint(cx, cy);
        }
        return new RoadNode();
    }

    public getWorldPointByPixel(x: number, y: number): Vec2{
        if (this._mapRoad) {
            return this._mapRoad.getWorldPointByPixel(x, y);
        }
        return math.v2(0, 0);
    }

    public getPixelByWorldPoint(cx: number, cy: number): Vec2 {
        if (this._mapRoad) {
            return this._mapRoad.getPixelByWorldPoint(cx, cy);
        }
        return math.v2(0, 0);
    }

    public getDerectByPixel(x: number, y: number): Vec2{
        if (this._mapRoad) {
            return this._mapRoad.getDerectByPixel(x, y);
        }
        return math.v2(0, 0);
    }

    public getDerectByWorldPoint(cx: number, cy: number): Vec2 {
        if (this._mapRoad) {
            return this._mapRoad.getDerectByWorldPoint(cx, cy);
        }
        return math.v2(0, 0);
    }

    public getPixelByDerect(dx: number, dy: number): Vec2 {
        if (this._mapRoad) {
            return this._mapRoad.getPixelByDerect(dx, dy);
        }
        return math.v2(0, 0);
    }


    public get mapWidth(): number {
        return this._mapWidth;
    }

    public get mapHeight(): number {
        return this._mapHeight;
    }

    public get nodeWidth(): number {
        return this._nodeWidth;
    }
   
    public get nodeHeight(): number {
        return this._nodeHeight;
    }

    public get halfNodeWidth(): number {
        return this._halfNodeWidth;
    }

    public get halfNodeHeight(): number {
        return this._halfNodeHeight;
    } 
    public get col(): number {
        return this._col;
    }
    public get row(): number {
        return this._row;
    }

    public get mapType(): MapType {
        return this._mapType;
    }
}
window["mapRoadUtils"] = MapRoadUtils.instance;

export interface IMapRoad {
    getNodeByPixel(x: number, y: number): RoadNode;
    getNodeByDerect(dx: number, dy: number): RoadNode;
    getNodeByWorldPoint(cx: number, cy: number): RoadNode;
    getWorldPointByPixel(x: number, y: number): Vec2;
    getPixelByWorldPoint(cx: number, cy: number): Vec2;
    getDerectByPixel(x: number, y: number): Vec2;
    getDerectByWorldPoint(cx: number, cy: number): Vec2;
    getPixelByDerect(dx: number, dy: number): Vec2;
}