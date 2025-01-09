import { _decorator, Component, JsonAsset, math, Node, resources, Vec2, Vec3 } from 'cc';
import BaseView from '../../ui/BaseView';
import { registerView } from '../../ui/ViewRegisterMgr';
import { PanelType } from '../../ui/PanelEnum';
import { LayerType } from '../../ui/LayerManager';
import { GameScene } from './GameScene';
import ViewConst from '../../ui/ViewConst';
import { HashMap } from '../../Common/maps/HashMap';
import { FightHeroInfo } from './infos/FightHeroInfo';
import { AFKGameConfigVo } from './vos/AFKGameConfigVo';
import { HeroConfigVo } from './vos/HeroConfigVo';
import { GameConst } from './GameConst';
import { FightRoleEntity } from './fight/FightRoleEntity';
import Utils from '../../Common/Utils';
import { FightMgr } from './fight/FightMgr';
import { FightConfig } from './fight/FightConfig';
const { ccclass, property } = _decorator;

@ccclass('AFKGame')
export class AFKGame extends BaseView {

    private scene: GameScene;

    private gameConfig: AFKGameConfigVo;

    private heroMap: HashMap<number, FightHeroInfo>;
    private enmeyMap: HashMap<number, FightHeroInfo>;

    private positionMap: HashMap<number, HashMap<number, Vec3>>;

    private isInit: boolean = false;
    start() {

    }

    update(deltaTime: number) {
        if (!this.isInit) {
            return;
        }
        FightMgr.instance.doFrameHandler();
    }

    public init(...args: any): void {
        this.heroMap = new HashMap<number, FightHeroInfo>();
        this.enmeyMap = new HashMap<number, FightHeroInfo>();
        this.positionMap = new HashMap<number, HashMap<number, Vec3>>();
        this.isInit = false;
    }

    public async onOpen(fromUI: number | string, ...args: any) {
        await this.loadConfig();
        this.scene = new GameScene();
        this.scene.init();
        this.scene.name = "afkScene";
        this.node.addChild(this.scene);

        for (let i: number = 0; i < 5; i++) {
            const leftNodeName: string = `left${i}`;
            const rightNodeName: string = `right${i}`;
            const leftNode: Node = Utils.FindChildByName(this.node, leftNodeName);
            const rightNode: Node = Utils.FindChildByName(this.node, rightNodeName);
            let leftMap: HashMap<number, Vec3> = this.positionMap.get(0);
            if (!leftMap) {
                leftMap = new HashMap<number, Vec3>();
            }
            let rightMap: HashMap<number, Vec3> = this.positionMap.get(1);
            if (!rightMap) {
                rightMap = new HashMap<number, Vec3>();
            }
            leftNode.active = rightNode.active = false;
            leftMap.put(i + 1, leftNode.position.clone());
            rightMap.put(i + 1, rightNode.position.clone());

            this.positionMap.put(0, leftMap);
            this.positionMap.put(1, rightMap);
        }

        const heros: FightHeroInfo[] = this.heroMap.values();
        const enmeys: FightHeroInfo[] = this.enmeyMap.values();


        for (let index = 0; index < heros.length; index++) {
            const element = heros[index];
            await this.createHero(element);
        }

        for (let index = 0; index < enmeys.length; index++) {
            const element = enmeys[index];
            await this.createHero(element);
        }
        FightMgr.instance.setRandomSeed(99856269);
        this.isInit = true;

    }

    private async loadConfig(): Promise<void> {
        return new Promise((resolve, reject) => {
            resources.load("afk/afkGameConfg", JsonAsset, (err, data: JsonAsset) => {
                if (err) {
                    reject(err);
                    return;
                }
                this.gameConfig = data.json as AFKGameConfigVo;
                FightConfig.instance.init(this.gameConfig);
                const heros = this.gameConfig.heros;
                for (const key in heros) {
                    if (Object.prototype.hasOwnProperty.call(heros, key)) {
                        const element: HeroConfigVo = heros[key];
                        const hid: number = Number(key);
                        const hero: FightHeroInfo = this.setFightHeroInfo(1000, element);
                        if (element.comp == 0) {
                            this.heroMap.put(hid, hero);
                        } else {
                            this.enmeyMap.put(hid, hero);
                        }
                    }
                }
                resolve()
            })
        })
    }

    private setFightHeroInfo(playerId: number, data: HeroConfigVo): FightHeroInfo {
        const heroInfo: FightHeroInfo = new FightHeroInfo();
        heroInfo.setData(playerId, data);
        return heroInfo;
    }

    private getPosition(info: FightHeroInfo): Vec3 {
        const comp: number = info.camp;
        const site: number = info.site;
        const posMap: HashMap<number, Vec3> = this.positionMap.get(comp);
        if (!posMap) {
            return math.v3(0, 0);
        }
        return posMap.get(site);
    }

    private createHero(fightHero: FightHeroInfo): Promise<void> {
        return new Promise((resolve, reject) => {
            this.create(FightRoleEntity, fightHero, this.scene, fightHero.camp == 0 ? GameConst.RIGHT : GameConst.LEFT).then(entity => {
                const position: Vec3 = this.getPosition(fightHero);
                entity.setLocation(position.x, position.y);
                entity.initHeadBar().then(e => {
                    FightMgr.instance.addEntity(entity);
                    console.log(`hero_${fightHero.spineId}`, entity.getBounds())
                    resolve();
                }).catch(bErr => {
                    reject(bErr);
                })

            }).catch(err => {
                reject(err);
            })
        })
    }

    private create<T extends FightRoleEntity>(c: { new(): T }, info: FightHeroInfo, scene: GameScene, dir: number = GameConst.RIGHT, action: string = GameConst.Idle): Promise<T> {
        return new Promise((reslove, reject) => {
            var entity: T = new c();
            entity.setData(info);
            if (!scene.getUnitById(entity.getId())) {
                scene.addUnit(entity);
            }
            entity.setRole(info.heroConfig.spineId).then(value => {
                entity.changeActionAndDirection(action, dir)
                reslove(entity);
            }).catch(err => {
                reject(err);
            })
        })

    }
}

registerView({ viewCls: AFKGame, id: PanelType.AFKGame, layer: LayerType.view, prefabPathPrefix: ViewConst.defaultPrefabPathPrefix + "afk/" })


