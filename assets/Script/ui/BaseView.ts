import {Component, Enum, _decorator, Node} from "cc";
import { ViewShowTypes } from "../Common/Enum";
import {Behaviour} from "db://assets/Script/modules/RPG/Behaviour";
/**
 * UIView界面基础类
 * 
 * 1. 快速关闭与屏蔽点击的选项配置
 * 2. 界面缓存设置（开启后界面关闭不会被释放，以便下次快速打开）
 * 3. 界面显示类型配置
 * 
 * 4. 加载资源接口（随界面释放自动释放），this.loadRes(xxx)
 * 5. 由UIManager释放
 * 
 * 5. 界面初始化回调（只调用一次）
 * 6. 界面打开回调（每次打开回调）
 * 7. 界面打开动画播放结束回调（动画播放完回调）
 * 8. 界面关闭回调
 * 9. 界面置顶回调
 */


export default abstract class BaseView extends Behaviour {

    public quickClose: boolean = false;
    /** 屏蔽点击选项 在UIConf设置屏蔽点击*/
    // @property
    // preventTouch: boolean = true;
    public cache: boolean = false;

    public showType: ViewShowTypes = ViewShowTypes.ViewSingle;

    /** 界面id */
    public UIid: number | string = 0;
    /**  静态变量，用于区分相同界面的不同实例 */
    private static uiIndex: number = 0;

    /********************** UI的回调 ***********************/
    /**
     * 当界面被创建时回调，生命周期内只调用
     * @param args 可变参数
     */
    public init(...args: any): void {

    }

    /**
     * 当界面被打开时回调，每次调用Open时回调
     * @param fromUI 从哪个UI打开的
     * @param args 可变参数
     */
    public onOpen(fromUI: number | string, ...args: any): void {

    }

    /**
     * 每次界面Open动画播放完毕时回调
     */
    public onOpenAniOver(): void {
    }

    /**
     * 当界面被关闭时回调，每次调用Close时回调
     * 返回值会传递给下一个界面
     */
    public onClose(): any {

    }

    /**
     * 当界面被置顶时回调，Open时并不会回调该函数
     * @param preID 前一个ui
     * @param args 可变参数，
     */
    public onTop(preID: number | string, ...args: any): void {

    }
}
