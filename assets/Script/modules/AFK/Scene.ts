import { Vec3 } from "cc";
import { HashMap } from "../../Common/maps/HashMap";
import { Containers } from "./Containers";
import { Unit } from "./Unit";
import { IDepthHelper } from "./depthHelper/DepthHelper";
import { GameConst } from "./GameConst";

/**
 * @fileName Scene.ts
 * @author zhangqiong
 * @date 2024/12/23 15:47:43"
 * @description
 */
export class Scene extends Containers {
    id: string;
    type: string;
    unitMap: HashMap<string, Unit>;
    unitNameMap: HashMap<string, Unit>;
    entityTypeMap: HashMap<number, Unit[]>;

    depthHelper: IDepthHelper[];

    layers: string[] = [];

    private _status: string;

    private queue: Unit[] = [];

    constructor() {
        super();
        this.unitMap = new HashMap<string, Unit>();
        this.unitNameMap = new HashMap<string, Unit>();
        this.entityTypeMap = new HashMap<number, Unit[]>();
        this.queue = [];
        this.depthHelper = [];
    }

    init(): void {
        this.removeDepth();

        this.layers = [
            GameConst.BG_LAYER,
            GameConst.MAP_Bottom_Role_LAYER,
            GameConst.MAP_LAYER,
            GameConst.DECORATE_LAYER,
            GameConst.MAP_SHADOW_LAYER,
            GameConst.MAP_MAGIC_LAYER,
            GameConst.MAP_EFFECT_LAYER,
            GameConst.MAP_DROP_LAYER,
            GameConst.EFFECT_Bottom_LAYER,
            GameConst.EFFECT_TOP_LAYER,
            GameConst.ROLE_LAYER,
            GameConst.ROLE_NAME_LAYER,
            GameConst.EFFECT_LAYER,
            GameConst.HIT_EFFECT_LAYER,
            GameConst.CENTER_LAYER,
            GameConst.TOP_LAYER,
            GameConst.HURT_EFFECT_LAYER,
        ]
        this.setContainers(this.layers);
        for (let i = 0; i < this.layers.length; i++) {
            const layerName: string = this.layers[i];

        }

        this.initDepthLayer();
        this.onInit();
    }

    setSort(v: boolean): void {
        if (this.depthHelper) {
            if (v) {
                for (const depth of this.depthHelper) {
                    depth.start(200);
                }
            } else {
                for (const depth of this.depthHelper) {
                    depth.stop();
                }
            }
        }
    }

    protected setDepths(depthLayers: string[], type: number = 1): void {
        for (let i = 0; i < depthLayers.length; i++) {
            const layer: string = depthLayers[i];
            //todo
            const depthHelper: IDepthHelper = null;
            depthHelper.layerName = layer;
            depthHelper.setTarget(this.getChildContainer(layer));
            this.depthHelper.push(depthHelper);
        }
        this.setSort(true);
    }

    initDepthLayer(): void {

    }

    enter(): void {

    }

    onEnter(): void {

    }

    leave(): void {

    }

    onLeave(): void {

    }


    protected onInit(): void {

    }

    clear(): void {
        this.entityTypeMap.clear();
    }


    setStatus(status: string): void {
        this._status = status;
    }

    getStatus(): string {
        return this._status;
    }

    resetUnitId(oldPartId: string, newPartId: string): void {
        if (this.unitMap.hasKey(oldPartId)) {
            const unit: Unit = this.unitMap.remove(oldPartId);
            this.unitMap.put(newPartId, unit);
        }
    }

    public getId(): string {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public setLocation(x: number, y: number): void {
        this.setPosition(x, y);
    }

    public getLocation(): Vec3 {
        return this.position.clone();
    }

    public getLocationScale(): Vec3 {
        return this.scale.clone();
    }

    removeDepth(): void {
        if (this.depthHelper) {
            for (let i = 0; i < this.depthHelper.length; i++) {
                this.depthHelper[i].destory();
            }
            this.depthHelper = [];
        }
    }

    destroy(): boolean {
        const unitObj: Object = this.unitMap.getContainer();
        for (const key in unitObj) {

        }

        this.unitMap.clear();
        this.unitNameMap.clear();

        return super.destroy();
    }

    updateScene(): void {

    }

    addUnit(unit: Unit): void {
        let isRepeat: boolean = false;
        if (this.unitMap.hasKey(unit.getId())) {
            isRepeat = true;
        }
        this.addUnitToTypeMap(unit);
        this.unitMap.put(unit.getId(), unit);
        this.unitNameMap.put(unit.getName(), unit);
        unit.setScene(this);
        if (!isRepeat) {
            this.queue.push(unit);
            this.queueAddChild();
        }
    }

    addUnitToTypeMap(unit: Unit): void {
        let units: Unit[] = this.entityTypeMap.get(unit.type);
        if (!units) {
            units = [];
            this.entityTypeMap.put(unit.type, units);
        }
        if (!this.unitMap.hasKey(unit.getId())) {
            units.push(unit);
        }
    }

    reomveUnitToTypeMap(unit: Unit): void {
        const units: Unit[] = this.entityTypeMap.get(unit.type);
        if (units) {
            for (let index = 0; index < units.length; index++) {
                const element: Unit = units[index];
                if (element.getId() == unit.getId()) {
                    units.splice(index, 1);
                    break;
                }
            }
        }
    }


    getUnitsByTypes(types: number[]): Unit[] {
        let results: Unit[] = [];
        for (let index = 0; index < types.length; index++) {
            const type: number = types[index];
            const units: Unit[] = this.entityTypeMap.get(type);
            if (units) {
                results = results.concat(units);
            }
        }
        return results
    }

    removeUnitById(id: string, isDispose: boolean = false): Unit {
        let unit: Unit = this.unitMap.remove(id);
        if (unit != null) {
            this.unitNameMap.remove(unit.getName());
            this.removeUnit(unit, isDispose);

        }
        return unit;
    }


    getUnits(type: number = 0): Unit[] {
        if (type == 0) {
            return this.unitMap.values();
        }
        let reuslts: Unit[] = [];
        const values: Unit[] = this.unitMap.values();
        let unit: Unit = null;
        for (let i: number = 0; i < values.length; i++) {
            unit = values[i];
            if (unit.getType() == type) {
                reuslts.push(unit);
            }
        }
        return reuslts;
    }

    removeUnitByName(name: string, isDispose: boolean = false): Unit {
        let unit: Unit = this.getUnitByName(name);
        if (unit != null) {
            return this.removeUnitById(unit.getId(), isDispose);
        }
        return null;
    }


    getUnitById(id: string): Unit {
        return this.unitMap.get(id);
    }

    getUnitByName(unitName: string): Unit {
        return this.unitNameMap.get(unitName);
    }

    private removeUnit(unit: Unit, isDispose: boolean = false): void {
        this.reomveUnitToTypeMap(unit);
        const queueIndex: number = this.queue.indexOf(unit)
        if (queueIndex != -1) {
            this.queue.splice(queueIndex, 1);
        }
        for (let i = 0; i < this.depthHelper.length; i++) {
            const depth: IDepthHelper = this.depthHelper[i];
            if (depth.layerName == unit.getLayer()) {
                depth.removeChild(unit.getDisplay());
            }
        }
        if (unit.getDisplay().parent == this.getChildContainer(unit.getLayer())) {
            this.getChildContainer(unit.getLayer()).removeChild(unit.getDisplay());
        }
        unit.onRemove();
        if (isDispose) {
            unit.destroy();
        }
    }

    queueAddChild(): void {
        if (this.queue.length > 0) {
            const unit: Unit = this.queue.shift();
            this.getChildContainer(unit.getLayer()).addChild(unit.getDisplay());
            unit.onAdd();

            for (let i = 0; i < this.depthHelper.length; i++) {
                if (this.depthHelper[i].layerName == unit.getLayer() && this.depthHelper != null) {
                    this.depthHelper[i].addChild(unit.getDisplay());
                }

            }

        }
    }
}