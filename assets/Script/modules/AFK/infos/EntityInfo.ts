/**
 * @fileName EntityInfo.ts
 * @author zhangqiong
 * @date 2024/12/26 19:42:50"
 * @description
 */
export class EntityInfo {
    private _name: string;
    private _entityId: string;
    onlyId: number;
    type: number;
    insId: number;

    public set name(v: string) {
        this._name = v;
    }

    public get name(): string {
        return this._name;
    }

    public setEntityId(id: number, type: number, ...args): void {
        this.type = type;
        this.onlyId = id;
        this._entityId = `s${id}_${args[0]}`
    }

    public getEntityId(): string {
        return this._entityId;
    }
}