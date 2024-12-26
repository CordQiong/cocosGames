import { _decorator, Color, Component, Graphics, Size, Vec2, Vec3, view } from 'cc';
import EntityLayer from "db://assets/Script/modules/RPG/layer/EntityLayer";
import { Enemy } from "db://assets/Script/modules/TowerDefense/Enemy";
import { TowerCharacter } from "db://assets/Script/modules/TowerDefense/TowerCharacter";
import { TowerBuildInfo } from "db://assets/Script/modules/TowerDefense/info/TowerBuildInfo";
import { TowerMapLayer } from './TowerMapLayer';
import { AnchorPointType, QuadTree, QuadTreeRect } from '../../Common/QuadTree';
import { Behaviour } from '../RPG/Behaviour';
import { GameElement } from "db://assets/Script/modules/GameElement";
import { Bullet } from "db://assets/Script/modules/TowerDefense/Bullet";
import { BulletManager } from "db://assets/Script/modules/TowerDefense/BulletManager";
import { Boss } from "db://assets/Script/modules/TowerDefense/Boss";
import { EffectManager } from "db://assets/Script/modules/TowerDefense/EffectManager";
import { TowerGameUIManager } from "db://assets/Script/modules/TowerDefense/TowerGameUIManager";
import {viewManager} from "db://assets/Script/ui/ViewManager";
import {PanelType} from "db://assets/Script/ui/PanelEnum";
import {TowerSceneMap} from "db://assets/Script/modules/TowerDefense/TowerSceneMap";
import {MapLoadModel} from "db://assets/Script/modules/RPG/Enum";
import {TowerMapDTO} from "db://assets/Script/modules/TowerDefense/info/TowerMapDTO";
import {TowerConfig} from "db://assets/Script/modules/TowerDefense/TowerConfig";

const { ccclass, property } = _decorator;

@ccclass('TowerLauncher')
export class TowerLauncher extends Component {

    @property(Graphics)
    public graphics: Graphics = null;
    // @property(TowerSceneMap)
    // public map: TowerSceneMap = null;

    private static _instance: TowerLauncher;
    public static get instance(): TowerLauncher {
        // if (!this._instance) {
        //     this._instance = new TowerLauncher();
        // }
        return this._instance;
    }

    public isInit: boolean = false;

    public speed: number = 1;
    public pause: boolean = false;
    public theme: number = 1;
    public gameOver: boolean = false;
    public mapId: number = 1;


    public popEnemyCount:number = 0;

    private _value: number = 0;
    public set value(value: number) {
        this._value = value;
        TowerGameUIManager.instance.updateValue(value);
    }
    public get value(): number {
        return this._value;
    }
    public constructor() {
        super();

    }

    private _entityLayer: EntityLayer;
    private _mapLayer: TowerMapLayer;

    private _enemyList: { [key: string]: Enemy };
    private _towerList: { [key: string]: TowerCharacter };
    private _boss: Boss;

    private _buildInfos: { [key: string]: TowerBuildInfo };

    private _mapPathCache: { [key: string]: Vec2[] };

    public quadTree: QuadTree<Behaviour> = null;

    public isDebug: boolean = true;

    protected onLoad() {
        if (!TowerLauncher._instance) {
            TowerLauncher._instance = this;
        } else {
            this.destroy();
        }
    }

    public init(entityLayer: EntityLayer, mapLayer: TowerMapLayer): void {
        this._entityLayer = entityLayer;
        this._mapLayer = mapLayer;
        this._enemyList = {};
        this._towerList = {};
        this._buildInfos = {};
        this._mapPathCache = {};
    }

    public async getWorldPath(): Promise<Vec2[]> {
        const mapKey: string = `${this.theme}_${this.mapId}`;
        let result: Vec2[] = this._mapPathCache[mapKey];
        if (result && result.length > 0) {
            return result;
        }
        if (this._mapLayer) {
            result = await this._mapLayer.animationPath.getWorldPathByMapId(this.mapId, this.theme);
            this._mapPathCache[mapKey] = result;
            return result;
        }
        return []
    }

    public addEnemy(enemy: Enemy): void {
        if (!enemy || !enemy.node) {
            return;
        }
        // this.quadTree.insert(enemy);
        this._enemyList[enemy.uuid] = enemy;
    }

    public removeEnemy(enemy: Enemy): void {
        if (!enemy || !enemy.node) {
            return;
        }
        // this.quadTree.remove(enemy);
        delete this._enemyList[enemy.uuid];
    }

    public addBuildInfo(build: TowerBuildInfo): void {
        this._buildInfos[build.id] = build;
    }

    public getBuildInfo(id: string): TowerBuildInfo {
        return this._buildInfos[id];
    }

    public getEnemySize(): number {
        if (!this._enemyList) {
            return 0;
        }
        return Object.keys(this._enemyList).length;
    }

    public addBoss(boss: Boss): void {
        this._boss = boss;
    }

    public addTower(tower: TowerCharacter): void {
        if (!tower || !tower.node) {
            return;
        }
        this._towerList[tower.uuid] = tower;
    }

    public removeTower(tower: TowerCharacter): void {
        if (!tower || !tower.node) {
            return;
        }
        delete this._towerList[tower.uuid];
    }

    public onGameStar(level:number):void{
        // const map:TowerSceneMap = this.node.getComponent(TowerSceneMap);
        // if(map){
        //     map.setMapId(level, MapLoadModel.single);
        // }
        // TowerSceneMap.instance.setMapId(level)
    }

    start() {
        // console.log("游戏管理脚本")
        // const size: Size = view.getVisibleSize();
        // const rect: QuadTreeRect = new QuadTreeRect(0, 0, size.width, size.height);
        // this.quadTree = new QuadTree<Behaviour>(rect, 10, 5, AnchorPointType.LeftDown);

        // this.onGameStar(1)
    }

    public initQuadTree(width:number,height:number): void {
        const rect: QuadTreeRect = new QuadTreeRect(0, 0, width, height);
        this.quadTree = new QuadTree<Behaviour>(rect, 10, 5, AnchorPointType.LeftDown);
    }

    update(deltaTime: number) {
        if (!this.isInit || this.gameOver || this.pause) {
            return;
        }
        this.quadTree.clear();

        const bullets: Bullet[] = BulletManager.instance.bulletList;
        if (bullets.length > 0) {
            for (let i = 0; i < bullets.length; i++) {
                const bullet = bullets[i];
                this.quadTree.insert(bullet)
            }
        }
        for (const key in this._towerList) {
            this.quadTree.insert(this._towerList[key]);
        }
        for (const key in this._enemyList) {
            this.quadTree.insert(this._enemyList[key]);
        }

        this.quadTree.insert(this._boss);



        if (bullets.length > 0) {
            for (let i = 0; i < bullets.length; i++) {
                const bullet = bullets[i];
                const child: Behaviour[] = [];
                this.quadTree.query(bullet.rect, child);
                if (child.length > 0) {
                    for (let j = 0; j < child.length; j++) {
                        const e = child[j];
                        if (e instanceof Enemy) {
                            console.log("子弹", bullet, "打中了", e);
                            e.damage(bullet.harm);

                            bullet.node.removeFromParent();
                            BulletManager.instance.release(bullet);
                            i--;
                        }

                    }
                }
            }
        }

        if (this._boss) {
            const collideBossElements: Behaviour[] = [];
            this.quadTree.query(this._boss.rect, collideBossElements);
            if (collideBossElements.length > 0) {
                for (let i = 0; i < collideBossElements.length; i++) {
                    const element = collideBossElements[i];
                    if (element instanceof Enemy) {
                        console.log("敌人", element, "跟boss碰撞了");
                        this._boss.bleeding();
                        element.die();
                    }
                }
            }
        }

        const mapData:TowerMapDTO = TowerConfig.instance.getMapData();
        if(mapData){
            const maxEnemy:number = mapData.enemyCount;
            if(this.popEnemyCount >= maxEnemy){
                this.gameOver =true;
                this.doGameOver(true);
            }
        }

        if (this.isDebug) {
            let qtList: QuadTree<Behaviour>[] = [];
            this.quadTree.getAllChildNodes(qtList)
            const rects = qtList.map(e => {
                return e.rect;
            }, this);
            this.drawRect(rects);
        }
    }


    private drawRect(rect: QuadTreeRect[]): void {
        this.graphics.clear();

        for (let index = 0; index < rect.length; index++) {
            const element = rect[index];
            this.graphics.fillColor = Color.RED;
            this.graphics.strokeColor = Color.YELLOW;
            this.graphics.lineWidth = 5;
            const x: number = element.x;
            const y: number = element.y;


            this.graphics.circle(element.x, element.y, 10);
            this.graphics.fill();

            this.graphics.rect(x, y, element.width, element.height);
            this.graphics.stroke();
        }
    }

    public drawPoint(point:Vec3,radius:number = 10):void{
        this.graphics.lineWidth = 5;
        this.graphics.fillColor = Color.RED;
        this.graphics.circle(point.x, point.y, radius);
        this.graphics.fill();
    }

    public doGameOver(isWin:boolean = false): void {
        if (Object.keys(this._enemyList).length > 0) {
            for (const key in this._enemyList) {
                if (Object.prototype.hasOwnProperty.call(this._enemyList, key)) {
                    const element = this._enemyList[key];
                    element.node.removeFromParent();
                    this.removeEnemy(element);
                }
            }
            this._enemyList = {};
        }
        BulletManager.instance.releaseAll();
        viewManager.open(PanelType.GameOverOrWin,isWin);
    }

    public restart(): void {
        this.gameOver = false;
        this.pause = false;
    }
}

window["TowerLauncher"] = TowerLauncher

