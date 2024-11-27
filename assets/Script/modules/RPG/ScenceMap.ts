import { _decorator, Camera, Canvas, Component, EventTouch, JsonAsset, math, Node, resources, Size, Texture2D, UITransform, Vec3, view } from 'cc';
import MapData from './map/MapData';
import { MapItemType, MapLoadModel } from './Enum';
import MapRoadUtils from './map/MapRoadUtils';
import PathFindingAgent from './map/PathFindingAgent';
import Player from './character/Player';
import EntityLayer from './layer/EntityLayer';
import MapLayer from './layer/MapLayer';
import { EditMonsterData, EditNpcData, EditSpawnPointData, EditTransferData } from './EditObjData';
import SpawnPoint from './transfer/SpawnPoint';
import { GameManager } from './GameManager';
import TransferDoor from './transfer/TransferDoor';
import { Monster } from './character/Monster';
import { Npc } from './character/Npc';
import MapParams from './info/MapParams';
const { ccclass, property } = _decorator;

@ccclass('ScenceMap')
export class ScenceMap extends Component {

    @property(Canvas)
    public canvas: Canvas;
    @property(Node)
    public layer: Node = null;

    @property(MapLayer)
    public mapLayer: MapLayer = null;

    @property(EntityLayer)
    public entityLayer: EntityLayer = null;

    @property(Camera)
    private camera: Camera = null;


    private _mapData: MapData;
    private _mapId: number;

    private targetPos: Vec3 = new Vec3(0, 0, 0);

    private winSize: Size = new Size();
    private _mapParams: MapParams = null;

    /**
    * 场景里所有的出生点
    */
    public spawnPointList: SpawnPoint[] = [];

    /**
     * 场景里所有的传送门
     */
    public transferDoorList: TransferDoor[] = [];

    /**
     * 场景里所有的npc
     */
    public npcList: Npc[] = [];

    /**
     * 场景里所有的怪物
     */
    public monsterList: Monster[] = [];

    private player: Player = null;;

    private isInit: boolean = false;


    start() {
        this.winSize = view.getVisibleSize();
        this.node.setPosition(math.v3(-this.winSize.width / 2, -this.winSize.height / 2));
        this.node.on(Node.EventType.TOUCH_START, this.onMapTouch, this);
        // this.node.on(Node.EventType.TOUCH_START, (event: EventTouch) => {
        //     const screenPoint = event.getLocation();
        //     console.log('全局点击的屏幕坐标:', screenPoint);
        // }, this);

        this.mapId = 1;
    }

    public set mapId(value: number) {
        this._mapId = value;
        this.loadMap(value);
    }

    public get mapId(): number{
        return this._mapId;
    }

    public loadMap(mapId: number, mapLoadModel: MapLoadModel = MapLoadModel.single) {
        if (mapLoadModel == MapLoadModel.single) {
            this.loadSingleMap(mapId);
        } else {
            // this.loadSlicesMap(mapId);
        }
    }

    protected loadSingleMap(mapId: number) {
        var dataPath: string = `Map/map${mapId}/map${mapId}`;
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

        this._mapParams = this.getMapParams(mapData, bgTexture,MapLoadModel.single);
        this.mapLayer.init(this._mapParams);

        PathFindingAgent.instance.init(mapData);
        var uiTransform = this.node.getComponent(UITransform);
        if (uiTransform) {
            uiTransform.width = this.mapLayer.width;
            uiTransform.height = this.mapLayer.height;
        }
        
        this.initMapElement();
        this.afterInitMapElement();
        this.initPlayer();

        this.setViewToPlayer();

        this.isInit = true;
    }

    private initMapElement(): void{
        const mapItems: any[] = this._mapData.mapItems;
        if (!mapItems) {
            return;
        }

        for (let i = 0; i < mapItems.length; i++) {
            const mapItem = mapItems[i];
            const mapItemType = mapItem.type;
            if (mapItemType == MapItemType.Npc) {
                this.initNpc(mapItem);
            } else if (mapItemType == MapItemType.Monster) {
                this.initMonster(mapItem);
            } else if (mapItemType == MapItemType.Transfer) {
                this.initTransferDoor(mapItem);
            } else if (mapItemType == MapItemType.SpawnPoint) {
                this.initSpawnPoint(mapItem);
            }
        }
    }

    /**
    * 初始化Npc
    */
    private initNpc(editData: EditNpcData) {
        var npc: Npc = GameManager.instance.getNPC();
        npc.node.parent = this.entityLayer.node;
        npc.initEditData(editData);
        npc.init();

    }

    /**
     * 初始化怪物
     */
    private initMonster(editData: EditMonsterData) {
        var monster: Monster = GameManager.instance.getMonster();
        monster.node.parent = this.entityLayer.node;
        monster.initEditData(editData);
        monster.init();
    }

    /**
     * 初始化传送门
     */
    private initTransferDoor(editData: EditTransferData) {
        var transferDoor: TransferDoor = GameManager.instance.getTransferDoor(editData.transferType);
        transferDoor.node.parent = this.entityLayer.node;
        transferDoor.initEditData(editData);
        transferDoor.init();
    }

    private initSpawnPoint(editData: EditSpawnPointData) {
        var spawnPoint: SpawnPoint = GameManager.instance.getSpawnPoint();
        spawnPoint.node.parent = this.entityLayer.node;
        spawnPoint.initEditData(editData);
        spawnPoint.init();
    }

    public initPlayer() {
        var spawnPoint: SpawnPoint = this.getSpawnPoint(0);

        this.player = GameManager.instance.getPlayer();
        this.player.node.parent = this.entityLayer.node;
        this.player.node.position = spawnPoint != null ? spawnPoint.node.position : new Vec3(1000, 1000, 0); //如果找得到出生点就初始化在出生点的位置，否则默认一个出生位置点给玩家，防止报错。
    }

    /**
     * 根据id获取出生点
     * @param spawnId 
     * @returns 
     */
    public getSpawnPoint(spawnId: number = 0) {
        for (var i: number = 0; i < this.spawnPointList.length; i++) {
            if (this.spawnPointList[i].spawnId == spawnId) {
                return this.spawnPointList[i];
            }
        }

        if (spawnId == 0) {
            //如果没有找到匹配的出生点，则寻找默认出生点
            for (var i: number = 0; i < this.spawnPointList.length; i++) {
                if (this.spawnPointList[i].defaultSpawn) {
                    return this.spawnPointList[i];
                }
            }
        }

        console.error(`地图${this._mapData.name}不存在这个出生点 spawnId = ${spawnId}`);

        return null;
    }

    private afterInitMapElement() {
        this.spawnPointList = this.getComponentsInChildren(SpawnPoint);
        this.transferDoorList = this.getComponentsInChildren(TransferDoor);
        this.npcList = this.getComponentsInChildren(Npc);
        this.monsterList = this.getComponentsInChildren(Monster);
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

        this.targetPos.z = this.camera.node.position.z;
        this.camera.node.position = this.targetPos;

        // if (this._mapParams.mapLoadModel == MapLoadModel.slices) {
        //     this.mapLayer.loadSliceImage(this.targetPos.x, this.targetPos.y);
        // }
    }


    /**
     * 视图跟随玩家
     * @param dt 
     */
    public followPlayer(dt: number) {
        if (this.player == null) {
            return;
        }

        this.targetPos = this.player.node.position.clone().subtract(new Vec3(this.winSize.width / 2, this.winSize.height / 2));

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


        this.targetPos.z = this.camera.node.position.z;

        //摄像机平滑跟随
        this.targetPos = this.camera.node.position.clone().lerp(this.targetPos, dt * 2.0);
        // this.camera.node.position = this.targetPos;
        this.camera.node.setPosition(this.targetPos);

        // if (this._mapParams.mapLoadModel == MapLoadModel.slices) {
        //     this.mapLayer.loadSliceImage(this.targetPos.x, this.targetPos.y);
        // }

    }

    /**
     * 将视野对准玩家
     */
    public setViewToPlayer(): void {
        this.setViewToPoint(this.player.node.position.x, this.player.node.position.y);
    }

    private onMapTouch(event: EventTouch): void { 
        var touPos: Vec3 = new Vec3(event.getUILocation().x, event.getUILocation().y);
        var targetPos: Vec3 = new Vec3();
        Vec3.add(targetPos, this.camera.node.position, touPos); //计算点击地图的位置，计算结果输出到targetPos
        console.log("点击的像素坐标", targetPos.x, targetPos.y);
        this.player.navTo(targetPos.x, targetPos.y);
        // console.log(this.player);
    }

    update(deltaTime: number) {

        if (!this.isInit) {
            return;
        }

        this.followPlayer(deltaTime);

    }
}


