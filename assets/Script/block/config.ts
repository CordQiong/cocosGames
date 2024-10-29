import { Vec2 } from "cc";

/** 游戏配置 */
export const config = {
    sceneWidth: 740,
    sceneHeight: 1200,
    /** 方格宽 */
    blockWidth: 90,
    /** 方格高 */
    blockHeight: 90,
    /** 小动物宽 */
    itemWidth: 78,
    /** 小动物高 */
    itemHeight: 67,
    /** 行数 */
    row: 20,
    /** 列数 */
    col: 10,
    /** 每次新生成形状时的中心位置 */
    startPos: new Vec2(1, 3),
    // 形状数据,以（1，1）为中心参考
    /** 长条形 */
    shape1: [
        [new Vec2(0, -1), new Vec2(0, 0), new Vec2(0, 1), new Vec2(0, 2)],
        [new Vec2(-1, 0), new Vec2(0, 0), new Vec2(1, 0), new Vec2(2, 0)],
        [new Vec2(0, -1), new Vec2(0, 0), new Vec2(0, 1), new Vec2(0, 2)],
        [new Vec2(-1, 0), new Vec2(0, 0), new Vec2(1, 0), new Vec2(2, 0)]
    ],
    /** 方形 */
    shape2: [
        [new Vec2(-1, -1), new Vec2(-1, 0), new Vec2(0, -1), new Vec2(0, 0)],
        [new Vec2(-1, -1), new Vec2(-1, 0), new Vec2(0, -1), new Vec2(0, 0)],
        [new Vec2(-1, -1), new Vec2(-1, 0), new Vec2(0, -1), new Vec2(0, 0)],
        [new Vec2(-1, -1), new Vec2(-1, 0), new Vec2(0, -1), new Vec2(0, 0)]
    ],
    /** T形 */
    shape3: [
        [new Vec2(0, -1), new Vec2(-1, 0), new Vec2(0, 0), new Vec2(0, 1)],
        [new Vec2(1, 0), new Vec2(-1, 0), new Vec2(0, 0), new Vec2(0, 1)],
        [new Vec2(0, -1), new Vec2(1, 0), new Vec2(0, 0), new Vec2(0, 1)],
        [new Vec2(0, -1), new Vec2(-1, 0), new Vec2(0, 0), new Vec2(1, 0)]
    ],
    /** L形 */
    shape4: [
        [new Vec2(-1, 0), new Vec2(0, 0), new Vec2(1, 0), new Vec2(1, 1)],
        [new Vec2(1, -1), new Vec2(0, -1), new Vec2(0, 0), new Vec2(0, 1)],
        [new Vec2(-1, -1), new Vec2(-1, 0), new Vec2(0, 0), new Vec2(1, 0)],
        [new Vec2(-1, 1), new Vec2(0, -1), new Vec2(0, 0), new Vec2(0, 1)]
    ],
    /** 翻转L */
    shape5: [
        [new Vec2(-1, 0), new Vec2(0, 0), new Vec2(1, 0), new Vec2(1, -1)],
        [new Vec2(-1, -1), new Vec2(0, -1), new Vec2(0, 0), new Vec2(0, 1)],
        [new Vec2(-1, 0), new Vec2(-1, 1), new Vec2(0, 0), new Vec2(1, 0)],
        [new Vec2(0, -1), new Vec2(0, 0), new Vec2(0, 1), new Vec2(1, 1)]
    ],
    /** S形 */
    shape6: [
        [new Vec2(-1, 0), new Vec2(-1, 1), new Vec2(0, -1), new Vec2(0, 0)],
        [new Vec2(-1, -1), new Vec2(0, -1), new Vec2(0, 0), new Vec2(1, 0)],
        [new Vec2(-1, 0), new Vec2(-1, 1), new Vec2(0, -1), new Vec2(0, 0)],
        [new Vec2(-1, -1), new Vec2(0, -1), new Vec2(0, 0), new Vec2(1, 0)]
    ],
    /** 翻转S */
    shape7: [
        [new Vec2(-1, -1), new Vec2(-1, 0), new Vec2(0, 0), new Vec2(0, 1)],
        [new Vec2(1, -1), new Vec2(-1, 0), new Vec2(0, 0), new Vec2(0, -1)],
        [new Vec2(-1, -1), new Vec2(-1, 0), new Vec2(0, 0), new Vec2(0, 1)],
        [new Vec2(1, -1), new Vec2(-1, 0), new Vec2(0, 0), new Vec2(0, -1)]
    ]
}
