import {
    _decorator,
    Camera,
    CCBoolean,
    Component,
    JsonAsset,
    math, Node,
    resources,
    Size,
    Texture2D,
    UITransform,
    Vec3,
    view
} from "cc";
import MapLayer from "db://assets/Script/modules/RPG/layer/MapLayer";
import EntityLayer from "db://assets/Script/modules/RPG/layer/EntityLayer";
import MapData from "db://assets/Script/modules/RPG/map/MapData";
import MapParams from "db://assets/Script/modules/RPG/info/MapParams";
import { MapItemType, MapLoadModel } from "db://assets/Script/modules/RPG/Enum";
import PathFindingAgent from "db://assets/Script/modules/RPG/map/PathFindingAgent";
import { TowerLauncher } from "db://assets/Script/modules/TowerDefense/TowerLauncher";
import { RootLauncher } from "./RootLauncher";
const { ccclass, property } = _decorator;
@ccclass("SceneBase")
export class SceneBase extends Component {
    @property(MapLayer)
    public mapLayer: MapLayer = null;

    @property(EntityLayer)
    public entityLayer: EntityLayer = null;

    // @property(Camera)
    // public camera: Camera = null;


    private _mapData: MapData;
    private _mapId: number;

    private targetPos: Vec3 = new Vec3(0, 0, 0);

    protected winSize: Size = new Size();
    private _mapParams: MapParams = null;


    protected isInit: boolean = false;

    protected start() {
        this.winSize = view.getVisibleSize();
        this.node.setPosition(math.v3(-this.winSize.width / 2, -this.winSize.height / 2));
        this.setMapId(1);
    }

    public get mapData(): MapData {
        return this._mapData;
    }

    public setMapId(mapId: number, mapLoadModel: MapLoadModel = MapLoadModel.single) {
        this._mapId = mapId;
        this.loadMap(mapId);
    }

    public get mapId(): number {
        return this._mapId;
    }

    private loadMap(mapId: number, mapLoadModel: MapLoadModel = MapLoadModel.single) {
        if (mapLoadModel == MapLoadModel.single) {
            this.loadSingleMap(mapId);
        } else {
            // this.loadSlicesMap(mapId);
        }
    }

    protected getMapPath(mapId: number): string {
        return ""
    }

    protected loadSingleMap(mapId: number) {
        var dataPath: string = this.getMapPath(mapId); //`Map/map${mapId}/map${mapId}`;
        resources.load(dataPath, JsonAsset, (error: Error, res: JsonAsset) => {
            if (error != null) {
                console.log("加载地图数据失败 path = ", dataPath, "error", error);
                return;
            }

            var mapData: MapData = res.json as MapData;

            var bgPath: string = dataPath + "/texture";
            resources.load(bgPath, Texture2D, (error: Error, tex: Texture2D) => {
                if (error != null) {
                    console.log("加载地图背景失败 path = ", bgPath, "error", error);
                    return;
                }
                console.log(mapData, tex);
                this.init(mapData, tex);
                // this.sceneMap.init(mapData, tex, MapLoadModel.single)
            });

        });
    }

    public init(mapData: MapData, bgTexture: Texture2D): void {
        this._mapData = mapData;

        this._mapParams = this.getMapParams(mapData, bgTexture, MapLoadModel.single);
        this.mapLayer.init(this._mapParams);

        PathFindingAgent.instance.init(mapData);
        var uiTransform = this.node.getComponent(UITransform);
        if (uiTransform) {
            uiTransform.width = this.mapLayer.width;
            uiTransform.height = this.mapLayer.height;
        }

        this.initMapData(mapData);
        this.isInit = true;
    }

    protected initMapData(mapData: MapData) {

    }



    /**
     * 获得地图参数
     * @param mapData
     * @param bgTex
     * @param mapLoadModel
     * @returns
     */
    public getMapParams(mapData: MapData, bgTex: Texture2D, mapLoadModel: MapLoadModel = 1): MapParams {
        //初始化底图参数
        var mapParams: MapParams = new MapParams();
        mapParams.name = mapData.name;
        mapParams.bgName = mapData.bgName;
        mapParams.mapType = mapData.type;
        mapParams.mapWidth = mapData.mapWidth;
        mapParams.mapHeight = mapData.mapHeight;
        mapParams.ceilWidth = mapData.nodeWidth;
        mapParams.ceilHeight = mapData.nodeHeight;
        mapParams.viewWidth = mapData.mapWidth > this.winSize.width ? this.winSize.width : mapData.mapWidth;
        mapParams.viewHeight = mapData.mapHeight > this.winSize.height ? this.winSize.height : mapData.mapHeight;
        mapParams.sliceWidth = 256;
        mapParams.sliceHeight = 256;
        mapParams.bgTex = bgTex;
        mapParams.mapLoadModel = mapLoadModel;

        return mapParams;
    }

    /**
     *把视野定位到给定位置
     * @param px
     * @param py
     *
     */
    public setViewToPoint(px: number, py: number): void {
        this.targetPos = new Vec3(px, py).subtract(new Vec3(this.winSize.width / 2, this.winSize.height / 2));

        if (this.targetPos.x > this._mapParams.mapWidth - this.winSize.width) {
            this.targetPos.x = this._mapParams.mapWidth - this.winSize.width;
        } else if (this.targetPos.x < 0) {
            this.targetPos.x = 0;

        }

        if (this.targetPos.y > this._mapParams.mapHeight - this.winSize.height) {
            this.targetPos.y = this._mapParams.mapHeight - this.winSize.height;
        } else if (this.targetPos.y < 0) {
            this.targetPos.y = 0;
        }
        const camera: Camera = RootLauncher.instance.mainCamera;
        this.targetPos.z = camera.node.position.z;
        camera.node.position = this.targetPos;

        // if (this._mapParams.mapLoadModel == MapLoadModel.slices) {
        //     this.mapLayer.loadSliceImage(this.targetPos.x, this.targetPos.y);
        // }
    }

    /**
     * 视图跟随
     * @param targetNode
     * @param dt
     */
    public followTarget(targetNode: Node, dt: number) {
        if (targetNode == null) {
            return;
        }

        this.targetPos = targetNode.position.clone().subtract(new Vec3(this.winSize.width / 2, this.winSize.height / 2));

        if (this.targetPos.x > this._mapParams.mapWidth - this.winSize.width) {
            this.targetPos.x = this._mapParams.mapWidth - this.winSize.width;
        } else if (this.targetPos.x < 0) {
            this.targetPos.x = 0;

        }

        if (this.targetPos.y > this._mapParams.mapHeight - this.winSize.height) {
            this.targetPos.y = this._mapParams.mapHeight - this.winSize.height;
        } else if (this.targetPos.y < 0) {
            this.targetPos.y = 0;
        }
        const camera: Camera = RootLauncher.instance.mainCamera;

        this.targetPos.z = camera.node.position.z;
        //摄像机平滑跟随
        this.targetPos = camera.node.position.clone().lerp(this.targetPos, dt * 2.0);
        // this.camera.node.position = this.targetPos;
        camera.node.setPosition(this.targetPos);

        // if (this._mapParams.mapLoadModel == MapLoadModel.slices) {
        //     this.mapLayer.loadSliceImage(this.targetPos.x, this.targetPos.y);
        // }

    }
}