import { _decorator, Component, JsonAsset, Node, resources } from 'cc';
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
const { ccclass, property } = _decorator;

@ccclass('AFKGame')
export class AFKGame extends BaseView {

    private scene: GameScene;

    private gameConfig: AFKGameConfigVo;

    private heroMap: HashMap<number, FightHeroInfo>;
    private enmeyMap: HashMap<number, FightHeroInfo>;
    start() {

    }

    update(deltaTime: number) {

    }

    public init(...args: any): void {
        this.heroMap = new HashMap<number, FightHeroInfo>();
        this.enmeyMap = new HashMap<number, FightHeroInfo>();
    }

    public async onOpen(fromUI: number | string, ...args: any) {
        await this.loadConfig();
        this.scene = new GameScene();
        this.scene.init();
        this.node.addChild(this.scene);
    }

    private async loadConfig() {
        resources.load("afk/afkGameConfg", JsonAsset, (err, data: JsonAsset) => {
            if (err) {
                console.error(err);
                return;
            }
            this.gameConfig = data.json as AFKGameConfigVo;

            const heros = this.gameConfig.heros;
            for (const key in heros) {
                if (Object.prototype.hasOwnProperty.call(heros, key)) {
                    const element: HeroConfigVo = heros[key];
                    const hid: number = Number(key);

                }
            }
            console.log("config", data.json);
        })
    }
}

registerView({ viewCls: AFKGame, id: PanelType.AFKGame, layer: LayerType.view, prefabPathPrefix: ViewConst.defaultPrefabPathPrefix + "afk/" })


