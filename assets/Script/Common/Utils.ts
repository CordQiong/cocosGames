import { BlockInputEvents, Button, Component, js, Node } from "cc";

/**
 * @class name : Utils
 * @description : 基本工具类
 * @author : Ran
 * @time : 2022.05.10
 */
export default class Utils {


    /**
     * 从子孙节点中找到第一个名字符合的节点，不包括目标节点本身。
     * 使用 深度优先的方式。
     * 若没有找到，则返回null
     * @param targetNode 
     * @param name 
     */
    public static FindChildByName(targetNode: Node, name: unknown): Node {
        if (!targetNode.children || targetNode.children.length <= 0) return null;
        for (let i = 0; i < targetNode.children.length; i++) {
            const child = targetNode.children[i];
            if (child.name == name) {
                return child;
            }

            let result = this.FindChildByName(child, name);
            if (result != null)
                return result;
        }
        return null;
    }


    /**
     * 获取显示对象hash值
     * @param obj 显示对象
     * @returns hash值或null
     */
    public static getHashCode(obj: any) {
        // return obj._objFlags != null ? obj._objFlags : null;
        return obj._id != null ? obj._id : null;
    }


    /**
     * 添加按钮点击事件
     * @param target - 目标节点或按钮组件
     * @param scriptNode - 响应函数script组件所属节点
     * @param scriptName - 响应函数script组件名称
     * @param functionName - 响应函数名称
     * @param data - 自定义参数
     * @returns true or false
     */
    public static addButtonClickHandler(target: Node | Button, scriptNode: Node, scriptName: string, functionName: string, data?: any) {
        let button: Button;
        if (target instanceof Button) button = target;
        else if (target instanceof Node) button = target.getComponent(Button);
        if (!button) {
            console.warn("addButtonClickHandler: target node has no button component");
            return false;
        }
        let h = new Component.EventHandler();
        h.target = scriptNode;
        h.component = scriptName;
        h.handler = functionName;
        h.customEventData = data;
        button.clickEvents = [];
        button.clickEvents.push(h);
        return true;
    }


    /**
     * 节点添加事件，这个方法默认会给节点添加屏蔽点击穿透组件
     * @param target - 事件节点
     * @param eventType - 事件类型
     * @param callback - 回调函数
     * @param callbackObj - 回调函数所属对象
     * @param once - 是否只监听一次
     * @param touchThough - 是否穿透
     */
    public static addNodeEvent(target: Node, eventType, callback: Function, callbackObj: any, once: boolean = false, touchThough: boolean = false) {
        if (once) {
            target.once(eventType, callback, callbackObj);
        } else {
            target.on(eventType, callback, callbackObj);
        }
        if (!touchThough) {
            if (!target.getComponent(BlockInputEvents)) {
                target.addComponent(BlockInputEvents);
            }
        }
    }


    /**
     * 查看类是否被ccclass修饰
     * @param constructor - 
     * @returns 
     */
    public static isCCClass(constructor: unknown): boolean {
        return constructor && constructor.hasOwnProperty("__ctors__");
    }


    /**
     * 节点控制脚本挂载
     * @param node - 
     * @param script - 
     */
    public static addNodeScript(node: Node, script: string): void;
    public static addNodeScript(node: Node, script: unknown): void;
    public static addNodeScript(node: Node, script: unknown): void {
        if (typeof script == "string") {
            let hasCls = js.getClassByName(script);
            if (hasCls == null) {
                console.error(` ***** ${script} does not decorated by ccclass ***** `);
                return;
            }
            let has = node.getComponent(script) != null;
            if (!has) node.addComponent(script);
        }
        else if (typeof script == "function") {
            if (!this.isCCClass(script)) {
                console.error(` ***** ${script} does not decorated by ccclass ***** `);
                return;
            }
            let has = node.getComponent(script as (new () => Component)) != null;
            if (!has) node.addComponent(script as (new () => Component));
        }
    }



    // class end
}
