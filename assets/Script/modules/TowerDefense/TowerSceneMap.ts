import {
    _decorator, EventTouch,
    instantiate, math,
    Node,
    NodeEventType,
    Prefab,
    resources,
    Sprite,
    SpriteFrame,
    Texture2D,
    UITransform,
    Vec2, Vec3, view
} from 'cc';
import { SceneBase } from "db://assets/Script/modules/SceneBase";
import { MapItemType, MapLoadModel, PathOptimize, PathQuadSeek } from "db://assets/Script/modules/RPG/Enum";
import MapData from "db://assets/Script/modules/RPG/map/MapData";
import PathFindingAgent from "db://assets/Script/modules/RPG/map/PathFindingAgent";
import RoadNode from "db://assets/Script/modules/RPG/map/RoadNode";
import { EditNpcData, EditSpawnPointData } from "db://assets/Script/modules/RPG/EditObjData";
import { Boss } from "db://assets/Script/modules/TowerDefense/Boss";
import { Enemy } from "db://assets/Script/modules/TowerDefense/Enemy";
import { TowerCharacter } from "db://assets/Script/modules/TowerDefense/TowerCharacter";
import { TowerLauncher } from "db://assets/Script/modules/TowerDefense/TowerLauncher";
import { TowerConst } from "db://assets/Script/modules/TowerDefense/TowerConst";
import { TowerBuildInfo } from "db://assets/Script/modules/TowerDefense/info/TowerBuildInfo";
import { TowerMapLayer } from './TowerMapLayer';
import { TowerConfig } from "db://assets/Script/modules/TowerDefense/TowerConfig";
import { TowerGameUIManager } from "db://assets/Script/modules/TowerDefense/TowerGameUIManager";
import { EffectManager } from "db://assets/Script/modules/TowerDefense/EffectManager";
import MapLayer from "db://assets/Script/modules/RPG/layer/MapLayer";

const { ccclass, property } = _decorator;

@ccclass('TowerSceneMap')
export class TowerSceneMap extends SceneBase {

    private static _instance: TowerSceneMap = null;
    public static get instance(): TowerSceneMap {
        return this._instance;
    }
    @property(Prefab)
    public bossPrefab: Prefab = null;

    @property(TowerMapLayer)
    public mapLayer: TowerMapLayer = null;


    @property(Prefab)
    public enemyPrefab: Prefab = null;

    @property([Prefab])
    public towerPrefab: Prefab[] = [];

    @property(Node)
    public effectLayer: Node = null;

    private spawnPointDatas: EditSpawnPointData[] = [];

    private maxEnemy: number = 10;

    private boss: Boss = null;

    protected onLoad() {
        // this.mapLayer =
        TowerSceneMap._instance = this;
    }

    // private mapPath: Vec2[] = [];
    start() {
        super.start();


        // this.winSize = view.getVisibleSize();


    }

    public setMapId(mapId: number, mapLoadModel?: MapLoadModel): void {
        super.setMapId(mapId, mapLoadModel);
        TowerLauncher.instance.mapId = mapId;
    }


    protected getMapPath(mapId: number): string {
        const themeId: number = TowerLauncher.instance.theme;
        return `tower/map/theme${themeId}/level${mapId}/level_${themeId}_${mapId}`
    }


    private initMapElement(): void {
        const mapItems: any[] = this.mapData.mapItems;
        if (!mapItems) {
            return;
        }
        TowerLauncher.instance.init(this.entityLayer, this.mapLayer as TowerMapLayer);
        for (let i = 0; i < mapItems.length; i++) {
            const mapItem = mapItems[i];
            const mapItemType = mapItem.type;
            if (mapItemType == MapItemType.Npc) {
                this.initBoss(mapItem);
            } else if (mapItemType == MapItemType.Monster) {
                // this.initMonster(mapItem);
            } else if (mapItemType == MapItemType.Transfer) {
                // this.initTransferDoor(mapItem);
            } else if (mapItemType == MapItemType.SpawnPoint) {
                this.initSpawnPoint(mapItem);
            }
        }
    }

    private initSpawnPoint(mapItem: EditSpawnPointData): void {
        this.spawnPointDatas.push(mapItem)
    }

    private initBoss(mapItem: EditNpcData): void {
        const node = instantiate(this.bossPrefab);
        const boss = node.getComponent(Boss);
        this.boss = boss;
        node.active = true;
        node.parent = this.entityLayer.node;
        boss.initEditData(mapItem);
        boss.init();
        TowerLauncher.instance.addBoss(boss);
    }

    private adapter(): void {
        const uiTransform: UITransform = this.node.getComponent(UITransform);
        const width: number = uiTransform ? uiTransform.width : 960;
        const height: number = uiTransform ? uiTransform.height : 640;
        const scale: number = Math.min(750 / width, 1335 / height);
        this.node.setScale(scale, scale);

        this.node.setPosition(math.v3(-(width * scale) / 2, -(height * scale) / 2));
    }

    protected initMapData(mapData: MapData) {
        this.isInit = false;
        let len: number = mapData.roadDataArr.length;
        let len2: number = mapData.roadDataArr[0].length;
        let value: number = 0;
        let dx: number = 0;
        let dy: number = 0;
        for (let i = 0; i < len; i++) {
            for (let j = 0; j < len2; j++) {
                value = mapData.roadDataArr[i][j];
                dx = j;
                dy = i;
                let node = PathFindingAgent.instance.getRoadNode(dx, dy);
                this.createRoad(node);
            }
        }

        const uiTransform: UITransform = this.node.getComponent(UITransform);
        const width: number = uiTransform ? uiTransform.width : 0;
        const height: number = uiTransform ? uiTransform.height : 0;


        this.adapter()

        TowerLauncher.instance.initQuadTree(width, height);

        this.spawnPointDatas = [];
        this.entityLayer.node.removeAllChildren();
        this.mapLayer.roadNode.removeAllChildren();
        PathFindingAgent.instance.setRoadSeekerPassCondition(this.onRoadSeekerPassCondition.bind(this));

        EffectManager.instance.initEffectLayer(this.effectLayer);
        this.initMapElement();

        TowerConfig.instance.loadConfig().then((config: any) => {
            TowerConfig.instance.initConfig(config);
            TowerLauncher.instance.isInit = true;
        }).catch(err => {
            console.error(err);
        })

        // TowerLauncher.instance.getWorldPath().then((paths: Vec2[]) => {
        //     // this.mapPath = paths;
        //
        //     TowerConfig.instance.loadConfig().then((config: any) => {
        //         TowerConfig.instance.initConfig(config);
        //         TowerLauncher.instance.isInit = true;
        //     }).catch(err => {
        //         console.error(err);
        //     })
        // }).catch(err => {
        //
        // });

        // this.createEnemy();
    }

    private createRoad(road: RoadNode): void {
        if (!road) {
            return;
        }
        if (road.value == 1) {
            return;
        }
        if (road.value == 0) {
            return;
        }
        let greenRoadPath: string = `tower/res/NormalMordel/Game/Grid/texture`
        let blueRoadPath: string = `tower/res/NormalMordel/Game/Grid/texture`
        let path = greenRoadPath;
        if (road.value == 3) {
            path = blueRoadPath;
        }
        resources.load(path, (error: Error, tex: Texture2D) => {
            const bgNode: Node = new Node();
            this.node.addChild(bgNode);
            bgNode.layer = this.node.layer;

            let sprite = bgNode.addComponent(Sprite);
            sprite.sizeMode = Sprite.SizeMode.CUSTOM;
            bgNode.getComponent(UITransform).width = this.mapData.nodeWidth;
            bgNode.getComponent(UITransform).height = this.mapData.nodeHeight;
            bgNode.getComponent(UITransform).anchorX = 0.5;
            bgNode.getComponent(UITransform).anchorY = 0.5;
            const sp = new SpriteFrame();
            sp.texture = tex;
            sprite.spriteFrame = sp;

            bgNode.setPosition(road.px, road.py);
            bgNode.parent = this.mapLayer.roadNode;

            const buildInfo: TowerBuildInfo = bgNode.addComponent(TowerBuildInfo);
            buildInfo.road = road;
            bgNode.on(NodeEventType.TOUCH_START, this.onClickTowerRoad, this)
            TowerLauncher.instance.addBuildInfo(buildInfo);
        })
    }

    private onClickTowerRoad(event: EventTouch): void {
        if (TowerLauncher.instance.gameOver || TowerLauncher.instance.pause || !TowerLauncher.instance.isInit) {
            return;
        }
        const node: Node = event.target;
        const buildInfo: TowerBuildInfo = node.getComponent(TowerBuildInfo);
        if (!buildInfo) {
            return;
        }
        if (buildInfo.tower) {
            //console.log("有炮塔了 选择移除还是升级");
            //this.removeTower(buildInfo)
            if (TowerGameUIManager.instance.reomoveUpdateState) {
                TowerGameUIManager.instance.reomoveUpdateState = false;
            } else {
                TowerGameUIManager.instance.showRemoveOrUpdate(true, buildInfo, this.reomveOrUpdateTower, this);
            }
        } else {
            // this.createTower(buildInfo);
            if (TowerGameUIManager.instance.selectedTowerState) {
                TowerGameUIManager.instance.selectedTowerState = false;
            } else {
                TowerGameUIManager.instance.showSelectTower(true, buildInfo, this.createTower, this)
            }

        }
    }

    private reomveOrUpdateTower(type: number, buildInfo: TowerBuildInfo): void {
        if (type == 1) { // 升级
            if (buildInfo && buildInfo.tower) {
                buildInfo.tower.updateLevel(buildInfo.tower.level + 1)
            }
        } else if (type == 2) { // 移除
            this.removeTower(buildInfo);
        }
        TowerGameUIManager.instance.showRemoveOrUpdate(false);
    }

    // private buildTower(towerId:number,pos:Vec3):void{
    //     console.log("选择建造",towerId);
    //
    //
    // }

    private async createEnemy() {
        const node = instantiate(this.enemyPrefab);
        node.active = true;
        const enemy = node.getComponent(Enemy);
        const spawnPoint: EditSpawnPointData = this.spawnPointDatas[0];
        node.setPosition(spawnPoint.x, spawnPoint.y);
        node.parent = this.entityLayer.node;
        PathFindingAgent.instance.updateRoadSeekerInfo(PathOptimize.none, PathQuadSeek.path_dire_4);

        // var roadNodeArr: RoadNode[] = PathFindingAgent.instance.seekPath(math.v2(node.position.x, node.position.y), math.v2(this.boss.x, this.boss.y));

        enemy.navTo(this.boss.x, this.boss.y);
        // this.enemyList.push(enemy);


        // enemy.navigationByPath(this.mapPath);
        TowerLauncher.instance.addEnemy(enemy);
    }

    private createTower(buildInfo: TowerBuildInfo): void {
        console.log("选择建造", buildInfo.selectedTowerId);
        const node: Node = instantiate(this.towerPrefab[Math.max(0, buildInfo.selectedTowerId - 1)]);
        node.active = true;
        const tower: TowerCharacter = node.getComponent(TowerCharacter);
        tower.towerId = buildInfo.selectedTowerId;
        tower.updateLevel(1);
        node.parent = this.entityLayer.node;
        node.setPosition(buildInfo.node.position.x, buildInfo.node.position.y);
        buildInfo.tower = tower;
        TowerLauncher.instance.addTower(tower);
    }

    private removeTower(buildInfo: TowerBuildInfo): void {
        if (!buildInfo.tower) {
            return;
        }
        buildInfo.tower.node.removeFromParent();
        TowerLauncher.instance.removeTower(buildInfo.tower);
        buildInfo.tower = null;
        if (buildInfo.removeBackCost != 0) {
            TowerLauncher.instance.value += buildInfo.removeBackCost;
        }
    }

    /**
     * 检测塔防地图路径点是否通过的条件
     * @param road
     * @private
     */
    private onRoadSeekerPassCondition(road: RoadNode): boolean {
        if (!road || road.value == 1 || road.value == 3) {
            return false;
        }
        return true;
    }

    private createEnemyDelay: number = 2;
    private _time: number = 0;



    update(deltaTime: number) {
        if (TowerLauncher.instance.gameOver || TowerLauncher.instance.pause || !TowerLauncher.instance.isInit) {
            return;
        }
        this._time += deltaTime;
        if (this._time >= this.createEnemyDelay) {
            const count: number = TowerLauncher.instance.getEnemySize();
            if (count < this.maxEnemy) {
                console.log("创建一个敌人")
                this.createEnemy();
            }
            this._time = 0;
        }
    }
}


