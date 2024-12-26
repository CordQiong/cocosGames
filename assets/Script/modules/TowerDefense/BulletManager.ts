import { _decorator, instantiate, Node, NodePool, Prefab } from 'cc';
import { Bullet } from "db://assets/Script/modules/TowerDefense/Bullet";
import { TowerLauncher } from "db://assets/Script/modules/TowerDefense/TowerLauncher";

const { ccclass, property } = _decorator;

@ccclass('BulletManager')
export class BulletManager {
    private static _instance: BulletManager = null;
    public static get instance(): BulletManager {
        if (!BulletManager._instance) {
            BulletManager._instance = new BulletManager();
        }
        return BulletManager._instance;
    }

    private _bulletPool: { [key: string]: NodePool } = null;

    public bulletList: Bullet[] = [];

    constructor() {
        this._bulletPool = {};
        this.bulletList = [];
    }

    public create(prefab: Prefab): Bullet {
        if (!prefab) {
            return null;
        }
        let node: Node = null
        let pool: NodePool = this._bulletPool[prefab.data.name];
        if (!pool) {
            pool = new NodePool();
        }
        if (pool.size() > 0) {
            node = pool.get();
        } else {
            node = instantiate(prefab);
        }
        const bullet: Bullet = node.getComponent(Bullet);
        // TowerLauncher.instance.quadTree.insert(bullet);
        this.bulletList.push(bullet);
        return bullet;
    }

    public release(bullet: Bullet): void {
        if (!bullet) {
            return;
        }
        // TowerLauncher.instance.quadTree.remove(bullet);
        const index: number = this.bulletList.indexOf(bullet);
        if (index > -1) {
            this.bulletList.splice(index, 1);
        }
        const pool: NodePool = this._bulletPool[bullet.node.name];
        if (pool) {
            pool.put(bullet.node);
        }
    }

    public releaseAll(): void {
        if (this.bulletList.length > 0) {
            for (let index = 0; index < this.bulletList.length; index++) {
                const bullet = this.bulletList[index];
                bullet.node.removeFromParent();
                this.release(bullet);
                this.bulletList.splice(index, 1);
                index--;
            }
        }
    }

    update(deltaTime: number) {

    }
}
