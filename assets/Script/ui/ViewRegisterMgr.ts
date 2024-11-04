import { js } from "cc";
import ViewRegisterVo from "./ViewRegisterVo";

const registerViews: ViewRegisterVo[] = [];
const registerViewDictionary: { [key: number | string]: ViewRegisterVo } = {};
const registerViewDictionaryByView: { [key: string]: ViewRegisterVo } = {};

export function registerView(vo: ViewRegisterVo): void {
    const className: string = js.getClassName(vo.viewCls);
    if (vo.id == null) {
        vo.id = className;
    }
    registerViews.push(vo);
    registerViewDictionary[vo.id] = vo;
    registerViewDictionaryByView[className] = vo;
}

export function getRegisteredViews(): ViewRegisterVo[] {
    return registerViews;
}

export function getViewRegisterVo(cls: unknown): ViewRegisterVo;
export function getViewRegisterVo(viewName: string): ViewRegisterVo;
export function getViewRegisterVo(id: number): ViewRegisterVo;

export function getViewRegisterVo(value: unknown): ViewRegisterVo {
    let vo: ViewRegisterVo = null;
    if (typeof value == "number" || typeof value == "string") {
        vo = registerViewDictionary[value];
        if (vo != null) {
            return vo;
        }
        vo = registerViewDictionaryByView[value];
    } else if (typeof value == "function") {
        let className: string = js.getClassName(value);
        vo = registerViewDictionaryByView[className];
    }
    return vo;
}