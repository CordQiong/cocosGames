import { Component } from "cc";
import { PanelType } from "./PanelEnum";
import { LayerType } from "./LayerManager";


export default class ViewRegisterVo {
    public id: PanelType | string;
    /** 父级id，缺省则挂到root下 */
    public parent?: number | string | unknown;
    /** 界面类 */
    public viewCls: { prototype: Component };
    /** 界面层级 */
    public layer: LayerType;
    /** 预制体路径前缀，缺省常量 */
    public prefabPathPrefix?: string;
    /** 预制体名称，需要带上除前缀路径外的路径，缺省类名 */
    public prefabName?: string;

    public preventTouch?: boolean = false;
}