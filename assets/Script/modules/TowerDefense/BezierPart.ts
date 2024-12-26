import {_decorator, Component, math, Node, Vec2} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BezierPart')
export class BezierPart {
    startPos: Vec2;
    cPos1: Vec2;
    cPos2: Vec2;
    endPos: Vec2;
    /**
     * 将贝塞尔曲线分成多个点，不包含开始端点
     */
    posArray: Vec2[] = [];
    lenght: number = null;
    constructor(startP: Vec2, cP1: Vec2, cP2: Vec2, endP: Vec2) {
        this.startPos = startP;
        this.cPos1 = cP1;
        this.cPos2 = cP2;
        this.endPos = endP;

        this.lenght = this.getBezierLen();
    }

    /**
     * 每隔len个像素生成一个点,曲线开始的端点不生成点
     * @param len
     */
    createPosArray(len: number) {
        let fn: number = Math.floor(this.lenght / len);
        let i: number = 1 / fn;
        for (let t = i; t <= 1; t += i) {
            let x: number = this.bezier(this.startPos.x, this.cPos1.x, this.cPos2.x, this.endPos.x, t);
            let y: number = this.bezier(this.startPos.y, this.cPos1.y, this.cPos2.y, this.endPos.y, t);
            this.posArray.push(math.v2(x, y));
        }
        if (this.posArray.length < fn) { //补上结束端点
            this.posArray.push(this.endPos);
        }
    }

    /**
     * 获得曲线长度
     * @param f 将一段曲线分为多少份来求长度,默认20
     */
    private getBezierLen(f: number = 20): number {
        let t: number = 1 / 20;
        let l: number = 0;
        let i: number;
        let cP: Vec2;
        let lastP: Vec2 = math.v2(0, 0);
        for (i = 0; i <= 1; i += t) {
            let x: number = this.bezier(this.startPos.x, this.cPos1.x, this.cPos2.x, this.endPos.x, i);
            let y: number = this.bezier(this.startPos.y, this.cPos1.y, this.cPos2.y, this.endPos.y, i);
            cP = math.v2(x, y);
            l += (cP.subtract(lastP)).length();
            lastP = cP;
        }
        return l;
    }

    private bezier(v1: number, v2: number, v3: number, v4: number, t: number): number {
        return v1 * Math.pow(1 - t, 3) + 3 * v2 * t * Math.pow(1 - t, 2) + 3 * v3 * t * t * (1 - t) + v4 * Math.pow(t, 3);
    }
}
