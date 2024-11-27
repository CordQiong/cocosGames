import { _decorator, Component, director, game, instantiate, Node, Prefab, Vec3 } from 'cc';
import Player from './character/Player';
import SpawnPoint from './transfer/SpawnPoint';
import TransferDoor from './transfer/TransferDoor';
import { Npc } from './character/Npc';
import { Monster } from './character/Monster';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    
    private static _instance: GameManager;
    public static get instance(): GameManager {

        return GameManager._instance;
    }

    /**
     * 玩家预制体
     */
    @property(Prefab)
    public playerPrefab: Prefab = null;

    /**
     * 怪物预制体
     */
    @property(Prefab)
    public monsterPrefab: Prefab = null;

    /**
     * npc预制体
     */
    @property(Prefab)
    public npcPrefab: Prefab = null;

    /**
     * 出生点预制体
     */
    @property(Prefab)
    public spawnPointPrefab: Prefab = null;

    /**
     * 传送点预制体
     */
    @property(Prefab)
    public transferDoorPrefabs: Prefab[] = [];

    protected onLoad(): void {
        if (!GameManager._instance) {
            GameManager._instance = this;
            director.addPersistRootNode(this.node);
            this.init();
        } else {
            this.node.destroy(); //场景里只能有一个GameManager,有多余的必须销毁
        }
    }

    public getPlayer(): Player {
        var node: Node = instantiate(this.playerPrefab);
        var player = node.getComponent(Player);
        player.node.position = new Vec3(0, 0, 0);
        player.node.active = true;
        return player;
    }

    /**
     * 获得npc
     * @param npcId 
     * @returns 
     */
    public getNPC(): Npc {
        var npc: Npc = instantiate(this.npcPrefab).getComponent(Npc);
        npc.node.active = true;
        npc.node.position = new Vec3(0, 0, 0);
        return npc;
    }

    /**
    * 获得怪物
    * @param monsterId 
    * @returns 
    */
    public getMonster(): Monster {
        var monster: Monster = instantiate(this.monsterPrefab).getComponent(Monster);
        monster.node.active = true;
        monster.node.position = new Vec3(0, 0, 0);

        return monster;
    }

    /**
    * 获得出生点资源
    * @returns 
    */
    public getSpawnPoint(): SpawnPoint {
        var spawnPoint: SpawnPoint = instantiate(this.spawnPointPrefab).getComponent(SpawnPoint);
        spawnPoint.node.active = true;
        spawnPoint.node.position = new Vec3(0, 0, 0);

        return spawnPoint;
    }

    /**
     * 获得传送点资源
     * @returns 
     */
    public getTransferDoor(type: number): TransferDoor {
        var index: number = 0;

        if (type < this.transferDoorPrefabs.length) {
            index = type;
        }

        var transferDoor: TransferDoor = instantiate(this.transferDoorPrefabs[index]).getComponent(TransferDoor);
        transferDoor.node.active = true;
        transferDoor.node.position = new Vec3(0, 0, 0);

        return transferDoor;
    }

    public init(): void{
        
    }
    
    start() {

    }

    update(deltaTime: number) {
        
    }
}


