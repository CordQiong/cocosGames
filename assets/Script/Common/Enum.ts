export enum TouchEvent {
    UP = "touch_up",
    RIGHT = "touch_right",
    DOWN = "touch_down",
    LEFT = "touch_left"
}

/** 界面展示类型 */
export enum ViewShowTypes {
    ViewFullScreen,       // 全屏显示，全屏界面使用该选项可获得更高性能
    ViewAddition,         // 叠加显示，性能较差
    ViewSingle,           // 单界面显示，只显示当前界面和背景界面，性能较好
};