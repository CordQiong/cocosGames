import { _decorator, Component, Node, ReflectionProbeType, UITransform, Vec2, Vec3 } from 'cc';
import { Containers } from './Containers';
import { Scene } from './Scene';
const { ccclass, property } = _decorator;

/**
 * @fileName Unit.ts
 * @author zhangqiong
 * @date 2024/12/18 16:27:46"
 * @description
 */
@ccclass('Unit')
export class Unit extends Containers {
    public type: number = 0;
    private mId: string;
    private mType: number;
    private mLayer: string;

    public mScene: Scene;
    isDestroy: boolean = false;

    mLocation: Vec2;
    protected onLoad(): void {
        this.mLocation = new Vec2();
    }
    start() {

    }

    update(deltaTime: number) {

    }

    public setId(id: string): void {
        this.mId = id;
    }
    public getId(): string {
        return this.mId;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public getName(): string {
        return this.name;
    }

    public setScene(scene: Scene): void {
        this.mScene = scene;
    }
    public getScene(): Scene {
        return this.mScene;
    }


    public setType(type: number): void {
        this.mType = type;
    }
    public getType(): number {
        return this.mType;
    }

    public setLayer(layer: string): void {
        this.mLayer = layer;
    }
    public getLayer(): string {
        return this.mLayer;
    }

    public remove(isDispose: boolean = true): void {
        if (this.scene) {
            this.mScene.remove
        } else {
            super.remove();
        }
    }

    destroy(): boolean {
        this.mId = null;
        this.mLayer = null;
        this.mScene = null;
        this.isDestroy = null;
        this.onDestroy();
        return super.destroy();
    }

    onDestroy(): void {

    }

    setLocation(x: number, y: number): void {
        this.setPosition(x, y);
    }
    getLocation(): Vec3 {
        return this.position.clone();
    }
    getDisplay(): Node {
        return this;
    }

    onAdd(): void {

    }
    onRemove(): void {

    }
    protected getBounds(): number[] {
        const uiTransform: UITransform = this.getComponent(UITransform);
        const width: number = uiTransform ? uiTransform.width : 0;
        const height: number = uiTransform ? uiTransform.height : 0;
        return [0, width, 0, height];
    }

    public checkIn(left: number, right: number, top: number, bottom: number): boolean {
        if (!this.mScene) {
            return false;
        }
        const b: number[] = this.getCheckInBounds();
        const e: boolean = b[0] > left && b[0] < right && b[1] > top && b[1] < bottom;
        return e;
    }

    private _cibs: number[];
    private getCheckInBounds(): number[] {
        if (!this._cibs) {
            this._cibs = [];
        }
        const pos: Vec3 = this.getLocation();
        const sceneScale: Vec3 = this.mScene.getLocationScale();
        const scenePos: Vec3 = this.mScene.getLocation();
        this._cibs[0] = pos.x * sceneScale.x + scenePos.x;
        this._cibs[1] = pos.y * sceneScale.y + scenePos.y;
        return this._cibs;
    }

    public setIsShow(v: boolean): void {
        if (this.active && v) {
            return;
        }
        this.active = v;
    }
}
