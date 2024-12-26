import { Vec2 } from "cc";
import IRoadSeeker from "../IRoadSeeker";
import AStarRoadSeeker from "./AStarRoadSeeker";
import MapData from "./MapData";
import MapRoadUtils from "./MapRoadUtils";
import RoadNode from "./RoadNode";
import {MapType, PathOptimize, PathQuadSeek} from "../Enum";

export default class PathFindingAgent {
    private static _instance: PathFindingAgent;
    public static get instance(): PathFindingAgent{
        if (!this._instance) {
            this._instance = new PathFindingAgent();
        }
        return this._instance;
    }

    private _mapData: MapData;

    private _mapType: MapType;
    private _roadDic: { [key: string]: RoadNode } = {};
    private _roadSeeker: IRoadSeeker;


    public init(mapData: MapData): void{
        this._mapData = mapData;
        this._mapType = mapData.type;
        MapRoadUtils.instance.updateMapInfo(mapData.mapWidth, mapData.mapHeight, mapData.nodeWidth, mapData.nodeHeight, mapData.type);

        this._roadDic = {};
        const roadDataArr: number[][] = this._mapData.roadDataArr;

        var len: number = this._mapData.roadDataArr.length;
        var len2: number = this._mapData.roadDataArr[0].length;

        let value: number = 0;
        let dx: number = 0;
        let dy: number = 0;
        let cx: number = 0;
        let cy: number = 0;

        for (let i = 0; i < len; i++) {
            for (let j = 0; j < len2; j++) {
                value = roadDataArr[i][j];
                dx = j;
                dy = i;

                const node: RoadNode = MapRoadUtils.instance.getNodeByDerect(dx, dy);
                node.value = value;
                

                this._roadDic[node.cx + "_" + node.cy] = node;
            }
            
        }

        this._roadSeeker = new AStarRoadSeeker(this._roadDic);
    }

    public updateRoadSeekerInfo(pathOptimize:PathOptimize,pathQuadSeek:PathQuadSeek):void{
        this._roadSeeker.setPathOptimize(pathOptimize);
        this._roadSeeker.setPathQuadSeek(pathQuadSeek);
    }

    public setRoadSeekerPassCondition(callback:Function):void{
        this._roadSeeker.setRoadNodePassCondition(callback);
    }

    public seekPath(startV2: Vec2, targetV2: Vec2): RoadNode[]{
        let startNode: RoadNode = this.getRoadNodeByPixel(startV2.x, startV2.y);
        let targetNode: RoadNode = this.getRoadNodeByPixel(targetV2.x, targetV2.y);
        const roadNodeArray: RoadNode[] = this._roadSeeker.seekPath(startNode, targetNode);
        // const roadNodeArray: RoadNode[] = this._roadSeeker.seekPath2(startNode, targetNode);
        return roadNodeArray;
    }

    public getRoadNodeByPixel(px: number, py: number): RoadNode{
        let point: Vec2 = MapRoadUtils.instance.getWorldPointByPixel(px, py);

        let node: RoadNode = this.getRoadNode(point.x, point.y);
        // if (this._mapType == MapType.Angle45) {
        //     node = this.getRoadNode(point.x, point.y);
        // }else if(this._mapType == MapType.Angle90) {
        //
        // }
        return node;

    }

    public getRoadNode(cx: number, cy: number): RoadNode{
        return this._roadSeeker.getRoadNode(cx, cy);
    }
}

window["PathFindingAgent"] = PathFindingAgent.instance;