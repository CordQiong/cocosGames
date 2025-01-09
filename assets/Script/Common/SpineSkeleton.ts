import { _decorator, Asset, assetManager, Component, ImageAsset, Node, resources, sp, TextAsset, Texture2D } from 'cc';
import AssetMgr from './AssetMgr';
import { GameConst } from '../modules/AFK/GameConst';
import { Handler } from './Handler';
import { ActionInfo } from '../modules/AFK/infos/ActionInfo';
const { ccclass, property } = _decorator;

@ccclass('SpineSkeleton')
export class SpineSkeleton extends Component {
    private skeleton: sp.Skeleton = null;

    private playTimes: number = -1;
    private _currentTimes: number = 0;
    private _currentAnimationName: string;
    private _endAnimationName: string;

    public keyFrameHandler: Handler;

    private runing: boolean = false;

    private animationQueue: ActionInfo[];

    private currentInfo: ActionInfo;

    private _rosolve: any;
    protected onLoad(): void {
        this.skeleton = this.node.getComponent(sp.Skeleton);
        if (!this.skeleton) {
            this.skeleton = this.node.addComponent(sp.Skeleton);
        }
        this.animationQueue = [];
        // this.skeleton.setCompleteListener(this.onAnimationComplete);
    }
    start() {

    }

    public setSpineId(spineId: number, animationName: string = GameConst.Idle): Promise<void> {
        return new Promise((resolve, reject) => {
            const skeletonPath: string = `spine/body/afk/hero/sanim_${spineId}`;
            resources.load(skeletonPath, sp.SkeletonData, (err, data: sp.SkeletonData) => {
                if (err) {
                    reject(err);
                    return;
                }
                this.skeleton.skeletonData = data;
                this.skeleton.setCompleteListener(this.onAimationComplete);
                const info: ActionInfo = new ActionInfo(animationName);
                this.setAnimation(info);
                resolve();
            })
        })
    }

    private _onPlay(info: ActionInfo): void {
        if (!info) {
            return;
        }
        if (this.skeleton && info.name != this._currentAnimationName) {
            this._currentTimes = 0;
            this._endAnimationName = info.endActionName;
            this._currentAnimationName = info.name;
            this.playTimes = info.times;
            this.skeleton.loop = true;
            if (this.playTimes != -1) {
                this.skeleton.setCompleteListener((enter: sp.spine.TrackEntry) => {
                    if (this.playTimes != -1) {
                        this._currentTimes++;
                        if (this._currentTimes >= this.playTimes) {
                            this.clear();
                            this.next();
                        }
                    }
                })
            } else {
                this.skeleton.setCompleteListener(null);
            }
            this.skeleton.setEventListener((entry: sp.spine.TrackEntry, event: sp.spine.Event) => {
                if (this.keyFrameHandler) {
                    this.keyFrameHandler.execute(entry, event);
                }
            })
            this.skeleton.animation = info.name;
        }
    }

    public setAnimation(info: ActionInfo): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!info) {
                reject("信息有误");
                return;
            }
            if (this.skeleton && info.name != this._currentAnimationName) {
                this._currentTimes = 0;
                this._endAnimationName = info.endActionName;
                this._currentAnimationName = info.name;
                this.playTimes = info.times;
                this.skeleton.loop = true;
                if (this.playTimes != -1) {
                    this.skeleton.setCompleteListener((enter: sp.spine.TrackEntry) => {
                        if (this.playTimes != -1) {
                            this._currentTimes++;
                            if (this._currentTimes >= this.playTimes) {
                                this.clear();
                                resolve();
                            }
                        }
                    })
                } else {
                    this.skeleton.setCompleteListener(null);
                }
                this.skeleton.setEventListener((entry: sp.spine.TrackEntry, event: sp.spine.Event) => {
                    if (this.keyFrameHandler) {
                        this.keyFrameHandler.execute(entry, event);
                    }
                })
                this.skeleton.animation = info.name;
                if (info.times == -1) {
                    resolve();
                }
            } else {
                resolve();
            }
        })
        // if (oper == GameConst.Action_Opre_One) {
        //     this.killAll();
        // }
        // this.animationQueue.push(info);
        // if (!this.runing) {
        //     if (this.animationQueue.length > 0)//判断队列中是否还有动作
        //     {
        //         this.runing = true;
        //         this.nextRun();
        //     }
        // }
    }

    killAll(): void {
        this.runCurrent()
        this.animationQueue = [];
        this.runing = false;
    }

    private runCurrent(): void {
        if (this.currentInfo) {
            if (this.currentInfo.handler) {
                this.currentInfo.handler.execute();
            }
            // if (this.currentInfo.endActionName) {
            //     this.playEndAnimation(this.currentInfo.endActionName)
            // }
        }
    }

    private nextRun(): void {
        this.runCurrent();
        this.currentInfo = this.animationQueue.shift();
        this._onPlay(this.currentInfo)
    }

    next(): void {
        if (this.animationQueue.length <= 0) {
            //队列无的话，停止
            this.runing = false;
            if (this.currentInfo) {
                if (this.currentInfo.handler) {
                    this.currentInfo.handler.execute();
                }
            }
        }
        else {
            this.nextRun();
        }
    }

    public get currentAnimation(): string {
        return this._currentAnimationName;
    }

    private playEndAnimation(name: string): void {
        let endAnimationName: string = name ? name : GameConst.Idle;
        const endInfo: ActionInfo = new ActionInfo(endAnimationName);
        this.setAnimation(endInfo);
    }

    private clear(): void {
        this.playTimes = -1;
        this._currentTimes = 0;
    }

    private onAimationComplete(entery: sp.spine.TrackEntry): void {
        if (this.playTimes == -1) {
            return;
        }
        this._currentTimes++;
        if (this._currentTimes >= this.playTimes) {
            this.clear();
            // this.playEndAnimation(GameConst.Idle);
            return;
        }
    }



    update(deltaTime: number) {

    }
}


