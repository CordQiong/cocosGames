import { Asset, assetManager, AssetManager, instantiate, Node, Prefab } from "cc";

/**
 * @class name : AssetManager
 * @description : 资源管理类
 * @author : Ran
 * @time : 2022.07.20
 */
export default class AssetMgr {


    private static _instance: AssetMgr;
    public static get instance(): AssetMgr {
        this._instance || (this._instance = new AssetMgr());
        return this._instance;
    }


    /**
     * 获取bundle，如果未加载则加载该bundle
     * @param nameOrUrl - bundle路径
     * @returns bundle对象
     */
    public getBundle(nameOrUrl: string): Promise<AssetManager.Bundle> {
        if (!nameOrUrl || nameOrUrl === "") return Promise.reject(" ***** ERROR Bundle name ***** ");
        const bundle = assetManager.getBundle(nameOrUrl);
        if (bundle) { return Promise.resolve(bundle); }
        return new Promise<AssetManager.Bundle>((resolve, reject) => {
            assetManager.loadBundle(nameOrUrl, (err, bundle) => {
                if (err) {
                    console.error(` ***** load bundle ${nameOrUrl} error: ${err} ***** `);
                    reject(err);
                }

                resolve(bundle);
            });
        });
    }


    /**
     * 加载文件
     * @template T extends cc.Asset - 资源类型
     * @param path - 资源路径，规则为: bundleName://assetName，缺省bundleName为resources
     * @returns 资源对象
     */
    public async load<T extends Asset>(path: string, cb?: Function): Promise<T> {
        let pathResult = this.parseAssetPath(path);
        if (pathResult == null) return Promise.reject(` ***** ERROR Bundle: ${path} ***** `);
        let { bundleName, assetName } = pathResult;
        let bundle = await this.getBundle(bundleName);
        if (!bundle) {
            if (cb) {
                cb(` ***** ERROR Bundle: ${bundleName} ***** `, null);
            }
            return Promise.reject(` ***** ERROR Bundle: ${bundleName} ***** `);
        }
        let asset = bundle.get(assetName);
        if (asset) {
            if (cb) {
                cb(null, asset);
            }
            return Promise.resolve(asset as T);
        }
        if (cb) {
            bundle.load(assetName, (err: unknown, asset: unknown) => {
                cb(err, asset);
            });
            return;
        }
        return new Promise<T>((resolve, reject) => {
            bundle.load(assetName, (err: unknown, resource: unknown) => {
                if (err) {
                    console.error(` ***** load asset ${path} error: ${err} ***** `);
                    reject(err);
                }
                resolve(resource as T);
            });
        });
    }


    /**
     * 预加载资源
     * @param path - 资源路径，规则为: bundleName://assetName，缺省bundleName为resources
     */
    public async preload(path: string) {
        let pathResult = this.parseAssetPath(path);
        if (pathResult == null) return Promise.reject(` ***** ERROR Bundle: ${path} ***** `);
        let { bundleName, assetName } = pathResult;
        let bundle = await this.getBundle(bundleName);
        if (!bundle) return;
        bundle.preload(assetName);
    }


    /**
     * 解析资源路径
     * @param path - 资源路径，规则为: bundleName://assetName，缺省bundleName为resources
     * @returns 资源路径中的bundleName和assetName
     */
    private parseAssetPath(path: string) {
        let bundleName: string, assetName: string;
        if (path.indexOf(":") != -1) {
            let regex = /(.*):\/\/(.*)/;
            let regexArr = path.match(regex);
            if (regexArr == null || regexArr.length <= 0) return null;
            bundleName = regexArr[1];
            assetName = regexArr[2];
        } else {
            bundleName = "resources"
            assetName = path;
        }
        return { bundleName, assetName };
    }


    /**
     * 释放资源
     * @param path - 资源路径，规则为: bundleName://assetName，缺省bundleName为resources
     * @param releaseBundle - 是否释放bundle，缺省为false
     */
    public release(path: string, releaseBundle: boolean = false) {
        let pathResult = this.parseAssetPath(path);
        if (pathResult == null) return Promise.reject(` ***** ERROR Bundle: ${path} ***** `);
        let { bundleName, assetName } = pathResult;
        let bundle = assetManager.getBundle(bundleName);
        if (!bundle) return;
        if (!releaseBundle) {
            bundle.release(assetName);
        } else {
            this.releaseBundle(bundle);
        }
    }


    /**
     * 释放bundle
     * @param bundle - bundle名字或bundle对象
     */
    public releaseBundle(bundle: string | AssetManager.Bundle) {
        if (typeof bundle === "string") {
            let b = assetManager.getBundle(bundle);
            if (!b) return;
            b.releaseAll();
            assetManager.removeBundle(b);
        } else {
            if (!bundle) return;
            bundle.releaseAll();
            assetManager.removeBundle(bundle);
        }
    }


    /* 释放所有资源 */
    public releaseAll() {
        assetManager.releaseAll();
    }


    /**
     * 创建预制体
     * @param prefabPath ：预制体路径，规则为: bundleName://assetName，缺省bundleName为resources
     */
    public async createPrefab(prefabPath: string): Promise<Node> {
        let p = await this.load<Prefab>(prefabPath);
        const node = instantiate(p);
        return node;
    }



    /**
     * base64转纹理
     * @param data - base64编码的字符串
     * @returns 纹理
     */
    public async base64ToTexture(data: string) {
        // return new Promise<Texture2D>((resolve, reject) => {
        //     let img = new Image();
        //     img.src = data;
        //     img.onload = (event) => {
        //         let texture = new Texture2D();
        //         // texture.initWithElement(img);
        //         // texture.handleLoadedTexture();
        //         resolve(texture);
        //     };
        // });
    }


    /**
     * base64转精灵
     * @param data - base64编码的字符串
     * @returns 精灵数据
     */
    public async base64ToSpriteFrame(data: string) {
        // let texture = await this.base64ToTexture(data);
        // return new SpriteFrame(texture);
    }


    // class end
}

// export const assetManager = AssetMgr.instance;
// window["assetManager"] = assetManager;
