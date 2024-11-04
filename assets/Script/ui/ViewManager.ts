import { BlockInputEvents, director, js } from "cc";
import { log } from "cc";
import { isValid } from "cc";
import { view } from "cc";
import { UITransform } from "cc";
import { instantiate } from "cc";
import { Node } from "cc";
import { ViewShowTypes } from "../Common/Enum";
import ViewRegisterVo from "./ViewRegisterVo";
import { getViewRegisterVo } from "./ViewRegisterMgr";
import LayerManager, { LayerType } from "./LayerManager";
import StringUtils from "../Common/StringUtils";
import ViewConst from "./ViewConst";
import AssetMgr from "../Common/AssetMgr";
import Utils from "../Common/Utils";
import BaseView from "./BaseView";

/**
 * UIManager界面管理类
 * 
 * 1.打开界面，根据配置自动加载界面、调用初始化、播放打开动画、隐藏其他界面、屏蔽下方界面点击
 * 2.关闭界面，根据配置自动关闭界面、播放关闭动画、恢复其他界面
 * 3.切换界面，与打开界面类似，但是是将当前栈顶的界面切换成新的界面（先关闭再打开）
 * 4.提供界面缓存功能
 * 
 * 2018-8-28 by 宝爷
 */

/** UI栈结构体 */
export interface UIInfo {
    uiId: number | string;
    uiView: BaseView | null;
    uiArgs: any;
    preventNode?: Node | null;
    zOrder?: number;
    openType?: 'quiet' | 'other';
    isClose?: boolean;
    resToClear?: string[];
    resCache?: string[];
}

// /** UI配置结构体 */
// export interface UIConf {
//     bundle?: string;
//     prefab: string;
//     preventTouch?: boolean;
// }

export type UIOpenBeforeCallback = (uiId: number, preUIId: number) => void;
export type UIOpenCallback = (uiId: number, preUIId: number) => void;
export type UICloseCallback = (uiId: number) => void;

export class ViewManager {
    /** 资源加载计数器，用于生成唯一的资源占用key */
    private useCount = 0;
    /** 背景UI（有若干层UI是作为背景UI，而不受切换等影响）*/
    private BackGroundUI = 0;
    /** 是否正在关闭UI */
    private isClosing = false;
    /** 是否正在打开UI */
    private isOpening = false;

    /** UI界面缓存（key为UIId，value为UIView节点）*/
    private UICache: { [UIId: number | string]: BaseView } = {};
    /** UI界面栈（{UIID + UIView + UIArgs}数组）*/
    private UIStack: UIInfo[] = [];
    /** UI待打开列表 */
    private UIOpenQueue: UIInfo[] = [];
    /** UI待关闭列表 */
    private UICloseQueue: BaseView[] = [];
    /** UI配置 */
    // private UIConf: { [key: number]: UIConf } = {};

    /** UI打开前回调 */
    public uiOpenBeforeDelegate: UIOpenBeforeCallback | null = null;
    /** UI打开回调 */
    public uiOpenDelegate: UIOpenCallback | null = null;
    /** UI关闭回调 */
    public uiCloseDelegate: UICloseCallback | null = null;



    /****************** 私有方法，UIManager内部的功能和基础规则 *******************/

    /**
     * 添加防触摸层
     * @param zOrder 屏蔽层的层级
     */
    private preventTouch(layer: LayerType, zOrder: number) {
        let viewContainer = LayerManager.getLayer(layer);
        if (!viewContainer) {
            console.warn(` -----  ${layer} layer container is null ----- `)
            return
        }
        let node = new Node()
        node.name = 'preventTouch';

        let uiCom = node.addComponent(UITransform);
        uiCom.setContentSize(view.getVisibleSize());

        node.on(Node.EventType.TOUCH_START, function (event: any) {
            event.propagationStopped = true;
        }, node);

        let child = director.getScene()!.getChildByName('Canvas');
        child!.addChild(node);
        uiCom.priority = zOrder - 0.01;
        return node;
    }

    /** 自动执行下一个待关闭或待打开的界面 */
    private autoExecNextUI() {
        // 逻辑上是先关后开
        if (this.UICloseQueue.length > 0) {
            let uiQueueInfo = this.UICloseQueue[0];
            this.UICloseQueue.splice(0, 1);
            this.close(uiQueueInfo);
        } else if (this.UIOpenQueue.length > 0) {
            let uiQueueInfo = this.UIOpenQueue[0];
            this.UIOpenQueue.splice(0, 1);
            this.open(uiQueueInfo.uiId, uiQueueInfo.uiArgs);
        }
    }

    /**
     * 自动检测动画组件以及特定动画，如存在则播放动画，无论动画是否播放，都执行回调
     * @param aniName 动画名
     * @param aniOverCallback 动画播放完成回调
     */
    private autoExecAnimation(uiView: BaseView, aniName: string, aniOverCallback: () => void) {
        // 暂时先省略动画播放的逻辑
        aniOverCallback();
    }

    /**
     * 自动检测资源预加载组件，如果存在则加载完成后调用completeCallback，否则直接调用
     * @param completeCallback 资源加载完成回调
     */
    private autoLoadRes(uiView: BaseView, completeCallback: () => void) {
        // 暂时先省略
        completeCallback();
    }

    /** 根据界面显示类型刷新显示 */
    private updateUI() {
        let hideIndex: number = 0;
        let showIndex: number = this.UIStack.length - 1;
        for (; showIndex >= 0; --showIndex) {
            let mode = this.UIStack[showIndex].uiView!.showType;
            // 无论何种模式，最顶部的UI都是应该显示的
            this.UIStack[showIndex].uiView!.node.active = true;
            if (ViewShowTypes.ViewFullScreen == mode) {
                break;
            } else if (ViewShowTypes.ViewSingle == mode) {
                for (let i = 0; i < this.BackGroundUI; ++i) {
                    if (this.UIStack[i]) {
                        this.UIStack[i].uiView!.node.active = true;
                    }
                }
                hideIndex = this.BackGroundUI;
                break;
            }
        }
        // 隐藏不应该显示的部分UI
        for (let hide: number = hideIndex; hide < showIndex; ++hide) {
            this.UIStack[hide].uiView!.node.active = false;
        }
    }


    /**
     * UI被打开时回调，对UI进行初始化设置，刷新其他界面的显示，并根据
     * @param viewVo 界面注册结构
     * @param uiView 界面对象
     * @param uiInfo 界面栈对应的信息结构
     * @param uiArgs 界面初始化参数
     */
    private onViewOpen(viewVo: ViewRegisterVo, uiView: BaseView, uiInfo: UIInfo, uiArgs: any) {
        if (null == uiView) {
            return;
        }
        // 激活界面
        uiInfo.uiView = uiView;
        uiView.node.active = true;
        let uiCom = uiView.getComponent(UITransform);
        if (!uiCom) {
            uiCom = uiView.addComponent(UITransform);
        }

        // 快速关闭界面的设置，绑定界面中的background，实现快速关闭
        if (uiView.quickClose) {
            let backGround = uiView.node.getChildByName('background');
            if (!backGround) {
                backGround = new Node()
                backGround.name = 'background';
                let uiCom = backGround.addComponent(UITransform);
                uiCom.setContentSize(view.getVisibleSize());
                uiView.node.addChild(backGround);
                uiCom.priority = -1;
            }
            backGround.targetOff(Node.EventType.TOUCH_START);
            backGround.on(Node.EventType.TOUCH_START, (event: any) => {
                event.propagationStopped = true;
                this.close(uiView);
            }, backGround);
        }
        const className: string = this.getViewClassName(viewVo.viewCls);
        // 添加到父节点
        let viewContainer = LayerManager.getLayer(viewVo.layer);
        if (viewContainer == null) {
            console.warn(` ----- open ${className} field container is null ----- `)
            return;
        }
        viewContainer.addChild(uiView.node)

        uiCom.priority = uiInfo.zOrder || this.UIStack.length;

        // 刷新其他UI
        this.updateUI();

        // 从那个界面打开的
        let fromUIID: number | string = 0;
        if (this.UIStack.length > 1) {
            fromUIID = this.UIStack[this.UIStack.length - 2].uiId
        }

        // 打开界面之前回调
        // if (this.uiOpenBeforeDelegate) {
        //     this.uiOpenBeforeDelegate(uiId, fromUIID);
        // }

        // 执行onOpen回调
        uiView.onOpen(fromUIID, uiArgs);
        this.autoExecAnimation(uiView, "uiOpen", () => {
            uiView.onOpenAniOver();
            // if (this.uiOpenDelegate) {
            //     this.uiOpenDelegate(uiId, fromUIID);
            // }
        });
    }

    public async open<T extends Node = Node>(cls: unknown, params?: unknown): Promise<T>;
    public async open<T extends Node = Node>(viewName: string, params?: unknown): Promise<T>;
    public async open<T extends Node = Node>(id: number, params?: unknown): Promise<T>;

    /** 打开界面并添加到界面栈中 */
    public async open<T extends Node = Node>(v: unknown, params?: unknown): Promise<T> {

        const viewVo: ViewRegisterVo = getViewRegisterVo(v);
        if (!viewVo) {
            console.error(` ***** view ${v} has not registered ***** `);
            return;
        }

        let uiInfo: UIInfo = {
            uiId: viewVo.id,
            uiArgs: params,
            uiView: null
        };

        if (this.isOpening || this.isClosing) {
            // 插入待打开队列
            this.UIOpenQueue.push(uiInfo);
            return;
        }

        let uiIndex = this.getViewIndex(viewVo.id);
        if (-1 != uiIndex) {
            // 重复打开了同一个界面，直接回到该界面
            this.closeToUI(v, params);
            return;
        }

        // 设置UI的zOrder
        uiInfo.zOrder = this.UIStack.length + 1;
        this.UIStack.push(uiInfo);

        // 先屏蔽点击
        if (viewVo.preventTouch) {
            uiInfo.preventNode = this.preventTouch(viewVo.layer, uiInfo.zOrder);
        }

        this.isOpening = true;

        this.getOrCreateUI(viewVo).then((viewNode: BaseView) => {
            if (uiInfo.isClose || view == null) {
                console.warn(`getOrCreateUI ${viewVo.id} faile!
                        close state : ${uiInfo.isClose} , uiView : ${view}`)
                this.isOpening = false;
                if (uiInfo.preventNode) {
                    uiInfo.preventNode.destroy();
                    uiInfo.preventNode = null;
                }
                return;
            }
            this.onViewOpen(viewVo, viewNode, uiInfo, params);
            this.isOpening = false;
            this.autoExecNextUI();
        })

    }


    /**
     * 添加阻止输入事件组件
     * @param node - 
     */
    private addBlockInputEvent(node: Node) {
        if (!node) return;
        if (!node.getComponent(BlockInputEvents)) node.addComponent(BlockInputEvents);
    }


    private getOrCreateUI(viewVo: ViewRegisterVo, params?: any): Promise<BaseView> {
        return new Promise(async (resolve, reject) => {
            if (!viewVo) {
                resolve(null);
                return;
            }
            // 如果找到缓存对象，则直接返回
            let uiView: BaseView | null = this.UICache[viewVo.id];
            if (uiView) {
                resolve(uiView);
                return
            }
            let className = this.getViewClassName(viewVo.viewCls);
            let prefabPathPrefix = viewVo.prefabPathPrefix;
            if (StringUtils.empty(prefabPathPrefix)) {
                prefabPathPrefix = ViewConst.defaultPrefabPathPrefix;
            }
            let prefabName = viewVo.prefabName;
            if (prefabName == null) {
                prefabName = className;
            }

            let prefabPath = prefabPathPrefix + prefabName;
            let node = await AssetMgr.instance.createPrefab(prefabPath);
            if (!node) {
                console.error(` ***** open ${className} failed ${prefabName} is not exist ***** `);
                resolve(null);
                return;
            }
            node.name = className;

            Utils.addNodeScript(node, viewVo.viewCls);
            const view: BaseView = this.getViewScript(className, node);
            if (view) {
                view.init(params);
            }
            this.UICache[viewVo.id] = view;
            resolve(view);
        })

    }

    /**
     * 替换栈顶界面
     * @param cls 需要打开的界面类
     * @param uiArgs 界面参数
     */
    public replace(cls: unknown, uiArgs?: unknown): void;
    /**
     * 替换栈顶界面
     * @param className 类名
     * @param uiArgs 界面参数
     */
    public replace(className: string, uiArgs?: unknown): void;
    /**
     * 替换栈顶界面
     * @param id 界面id
     * @param uiArgs 界面参数
     */
    public replace(id: number, uiArgs?: unknown): void;
    /** 替换栈顶界面 */
    public replace(v: unknown, uiArgs: any = null) {
        let uiId: number | string = this.getUnifyParam(v);
        this.close(this.UIStack[this.UIStack.length - 1].uiView!);
        this.open(uiId, uiArgs);
    }

    /**
     * 关闭当前界面
     * @param closeUI 要关闭的界面
     */
    public close(closeUI?: BaseView) {
        let uiCount = this.UIStack.length;
        if (uiCount < 1 || this.isClosing || this.isOpening) {
            if (closeUI) {
                // 插入待关闭队列
                this.UICloseQueue.push(closeUI);
            }
            return;
        }

        let uiInfo: UIInfo | undefined;
        if (closeUI) {
            for (let index = this.UIStack.length - 1; index >= 0; index--) {
                let ui = this.UIStack[index];
                if (ui.uiView === closeUI) {
                    uiInfo = ui;
                    this.UIStack.splice(index, 1);
                    break;
                }
            }

        } else {
            uiInfo = this.UIStack.pop();
        }
        // 找不到这个UI
        if (uiInfo === undefined) {
            return;
        }

        // 关闭当前界面
        let uiId = uiInfo.uiId;
        let uiView = uiInfo.uiView;
        uiInfo.isClose = true;

        // 回收遮罩层
        if (uiInfo.preventNode) {
            uiInfo.preventNode.destroy();
            uiInfo.preventNode = null;
        }

        if (!uiView) {
            return;
        }

        let preUIInfo = this.UIStack[uiCount - 2];
        // 处理显示模式
        this.updateUI();
        let close = () => {
            this.isClosing = false;
            // 显示之前的界面
            if (preUIInfo && preUIInfo.uiView && this.isTopUI(preUIInfo.uiId)) {
                // 如果之前的界面弹到了最上方（中间有肯能打开了其他界面）
                preUIInfo.uiView.node.active = true
                // 回调onTop
                preUIInfo.uiView.onTop(uiId, uiView!.onClose());
            } else {
                uiView!.onClose();
            }

            // if (this.uiCloseDelegate) {
            //     this.uiCloseDelegate(uiId);
            // }
            if (uiView!.cache) {
                this.UICache[uiId] = uiView!;
                uiView!.node.removeFromParent();
                log(`uiView removeFromParent ${uiInfo!.uiId}`);
            } else {
                // uiView!.releaseAssets();
                uiView!.node.destroy();
                log(`uiView destroy ${uiInfo!.uiId}`);
            }
            this.autoExecNextUI();
        }
        // 执行关闭动画
        this.autoExecAnimation(uiView, "uiClose", close);
    }

    /** 关闭所有界面 */
    public closeAll() {
        // 不播放动画，也不清理缓存
        for (const uiInfo of this.UIStack) {
            uiInfo.isClose = true;
            if (uiInfo.preventNode) {
                uiInfo.preventNode.destroy();
                uiInfo.preventNode = null;
            }
            if (uiInfo.uiView) {
                uiInfo.uiView.onClose();
                // uiInfo.uiView.releaseAssets();
                uiInfo.uiView.node.destroy();
            }
        }
        this.UIOpenQueue = [];
        this.UICloseQueue = [];
        this.UIStack = [];
        this.isOpening = false;
        this.isClosing = false;
    }

    public closeToUI(cls: unknown, params?: unknown, bOpenSelf?: boolean): void;
    public closeToUI(viewName: string, params?: unknown, bOpenSelf?: boolean): void;
    public closeToUI(id: number, params?: unknown, bOpenSelf?: boolean): void;
    /**
     * 关闭界面，一直关闭到顶部为uiId的界面，为避免循环打开UI导致UI栈溢出
     * @param uiId 要关闭到的uiId（关闭其顶部的ui）
     * @param uiArgs 打开的参数
     * @param bOpenSelf 
     */
    public closeToUI(v: unknown, uiArgs: any, bOpenSelf = true): void {
        let idx = this.getViewIndex(v);
        if (-1 == idx) {
            return;
        }

        idx = bOpenSelf ? idx : idx + 1;
        for (let i = this.UIStack.length - 1; i >= idx; --i) {
            let uiInfo = this.UIStack.pop();
            if (!uiInfo) {
                continue;
            }

            let uiId = uiInfo.uiId;
            let uiView = uiInfo.uiView;
            uiInfo.isClose = true

            // 回收屏蔽层
            if (uiInfo.preventNode) {
                uiInfo.preventNode.destroy();
                uiInfo.preventNode = null;
            }

            // if (this.uiCloseDelegate) {
            //     this.uiCloseDelegate(uiId);
            // }

            if (uiView) {
                uiView.onClose()
                if (uiView.cache) {
                    this.UICache[uiId] = uiView;
                    uiView.node.removeFromParent();
                } else {
                    // uiView.releaseAssets();
                    uiView.node.destroy();
                }
            }
        }

        this.updateUI();
        this.UIOpenQueue = [];
        this.UICloseQueue = [];
        bOpenSelf && this.open(v, uiArgs);
    }

    /** 清理界面缓存 */
    public clearCache(): void {
        for (const key in this.UICache) {
            let ui = this.UICache[key];
            if (isValid(ui.node)) {
                if (isValid(ui)) {
                    // ui.releaseAssets();
                }
                ui.node.destroy();
            }
        }
        this.UICache = {};
    }

    /******************** UI的便捷接口 *******************/
    public isTopUI(uiId: number | string): boolean {
        if (this.UIStack.length == 0) {
            return false;
        }
        return this.UIStack[this.UIStack.length - 1].uiId == uiId;
    }

    public getView(uiId: number): BaseView | null {
        for (let index = 0; index < this.UIStack.length; index++) {
            const element = this.UIStack[index];
            if (uiId == element.uiId) {
                return element.uiView;
            }
        }
        return null;
    }

    public getTopUI(): BaseView | null {
        if (this.UIStack.length > 0) {
            return this.UIStack[this.UIStack.length - 1].uiView;
        }
        return null;
    }

    private getViewScript<T extends BaseView = BaseView>(className: string, node: Node): T {
        return node.getComponent(className) as T;
    }

    /**
     * 获取界面类名
     * @param cls - 界面类
     * @returns 界面类名称字符串
     */
    private getViewClassName(cls: unknown): string {
        let className = "";
        if (typeof cls === "string") className = cls;
        else if (typeof cls === "function") className = js.getClassName(cls);
        else if (typeof cls === "object") className = js.getClassName(cls.constructor);
        else
            console.error("ViewManager.getViewClassName: cls is not string or function");
        return className;
    }


    /**
     * 参数归一化
     * @param v 
     */
    public getUnifyParam(v: unknown): number | string {
        let id: number | string = null;
        if (typeof v == "number" || typeof v == "string") {
            id = v;
        } else if (typeof v == "function") {
            id = this.getViewClassName(v);
        } else if (typeof v == "object") {
            id = (v as ViewRegisterVo).id;
        }
        return id;
    }


    public getViewIndex(cls: unknown): number;
    public getViewIndex(className: string): number;
    public getViewIndex(id: number): number;
    public getViewIndex(vo: ViewRegisterVo): number;
    public getViewIndex(v: unknown): number {
        let id: number | string = this.getUnifyParam(v);
        for (let index = 0; index < this.UIStack.length; index++) {
            const element = this.UIStack[index];
            if (id == element.uiId) {
                return index;
            }
        }
        return -1;
    }

    public getIsOpen(clas: unknown): boolean;
    public getIsOpen(className: string): boolean;
    public getIsOpen(id: number): boolean;
    public getIsOpen(v: unknown): boolean {
        let index: number = this.getViewIndex(v);
        return index != -1;
    }
}

export let viewManager: ViewManager = new ViewManager();
