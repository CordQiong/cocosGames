import { MapType } from "../Enum";

export default class MapData {
    public name: string;
    public bgName: string;
    public type: MapType;
    public mapWidth: number;
    public mapHeight: number;

    public nodeWidth: number;
    public nodeHeight: number;
    public alignment: number;
    public offsetX: number;
    public offsetY: number;

    public roadDataArr: number[][];

    public mapItems: any[];
    
}