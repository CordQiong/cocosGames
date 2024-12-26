import {_decorator, animation, Animation, AnimationClip,
    Color, Component, Graphics, math, Node, RealCurve, RealKeyframeValue, resources, Vec2} from 'cc';
import {BezierPart} from "db://assets/Script/modules/TowerDefense/BezierPart";
import { TowerLauncher } from './TowerLauncher';
const { ccclass, property } = _decorator;

@ccclass('AnimationPath')
export class AnimationPath extends Component {
    private animation:Animation;
    private graphics:Graphics;

    private p2pDistance: number = 25;
    protected onLoad() {
        this.animation = this.getComponent(Animation);
        if (!this.animation) {
            this.animation = this.node.addComponent(Animation);
        }
        this.graphics = this.node.getComponent(Graphics);
        if (!this.graphics) {
            this.graphics = this.node.addComponent(Graphics);
        }
        // this.graphics.fillColor = math.color(255,0,0,255)
    }

    start() {
        // this.getWorldPath()
        this.getWorldPathByMapId(1);
    }

    update(deltaTime: number) {
        
    }

    public getWorldPathByMapId(mapId: number, themeId: number = TowerLauncher.instance.theme): Promise<Vec2[]>{
        return new Promise((resolve, reject) => { 
            const path: string = `anim/map/map${themeId}_${mapId}`
            resources.load(path, (err: Error, data: any) => {
                if (err) {
                    console.error(err);
                    reject(err);
                    return;
                }
                console.log(data);
                const path: Vec2[] = this.getNodePath(data);
                this.drawPoint(path, Color.RED);
                resolve(path)
            })
        })
    }

    /**
     * Gets world path
     *
     * @returns world path
     */
    getWorldPath(): Vec2[] {
        const clips: AnimationClip[] = this.animation.clips;
        let path = this.getNodePath(clips[0]);
        console.log(path);
        this.drawPoint(path,Color.RED);
        return path
        // for (let i = 0; i < path.length; i++)
        //     path[i] = this.node.getWorldPosition(path[i]);
        // return path;
    }

    /**
     *
     * @returns 节点坐标
     */
    private getNodePath(clip:AnimationClip): Vec2[] {
        let track:animation.Track = clip.tracks[0];
        const channels = track.channels();
        const xcurve:RealCurve = channels[0].curve;
        const ycurve: RealCurve = channels[1].curve;

        const xkeyFrame: RealKeyframeValue[] = xcurve.values() as RealKeyframeValue[];
        const ykeyFrame: RealKeyframeValue[] = ycurve.values() as RealKeyframeValue[];
        // let paths =  clip.curves//clip.curveData.paths; //动画路径数组
        // let frameArray = paths[pathName].props.position; //关键帧数组即为一条路径
        let bezierPartArray: Vec2[] = this.getBezierPartArray(xkeyFrame,ykeyFrame);
        // let path: Vec2[] = this._getPath(bezierPartArray);

        return bezierPartArray;
    }

    /**
     * 得到点路径
     * @param bezierPartArray 曲线数组
     * @returns path 不含路径起点坐标
     */
    private _getPath(bezierPartArray: BezierPart[]): Vec2[] {
        let pArray: Vec2[] = [];
        let bezier: BezierPart;
        for (let i = 0; i < bezierPartArray.length; i++) {
            bezier = bezierPartArray[i];
            bezier.createPosArray(16);
            pArray = pArray.concat(bezier.posArray);

        }
        return pArray;
    }

    /**
     * 由关键帧数组 得到 曲线段数组
     * @param xframeArray
     * @param yframeArray
     */
    private getBezierPartArray(xframeArray: RealKeyframeValue[], yframeArray: RealKeyframeValue[]): Vec2[] {
        let bezierPartArray: Vec2[] = [];

        const maxLength: number = Math.max(xframeArray.length, yframeArray.length);
        //两个关键帧组成一条路径
        for (let j = 0; j < maxLength - 1; j++) {
            const xKeyFrame: RealKeyframeValue = xframeArray[j];
            const yKeyFrame: RealKeyframeValue = yframeArray[j];
            const nextXKeyFrame: RealKeyframeValue = xframeArray[j + 1];
            const nextYKeyFrame: RealKeyframeValue = yframeArray[j + 1];
            let arr: Vec2[] = this.createBezierPartArray(xKeyFrame,yKeyFrame,nextXKeyFrame,nextYKeyFrame);
            bezierPartArray = bezierPartArray.concat(arr);
        }

        return bezierPartArray;
    }

    /**
     * 由两个关键帧 生成 它们构成的贝塞尔曲线段数组
     * @param startXKeyFrame
     * @param startYKeyFrame
     * @param endXKeyFrame
     * @param endYKeyFrame
     */
    private createBezierPartArray(startXKeyFrame:RealKeyframeValue,startYKeyFrame:RealKeyframeValue, endXKeyFrame:RealKeyframeValue,endYKeyFrame:RealKeyframeValue): Vec2[] {
        let bezierPartArray: BezierPart[] = [];

        const startPoint:Vec2 = math.v2(startXKeyFrame.value,startYKeyFrame.value);
        const endPoint:Vec2 = math.v2(endXKeyFrame.value,endYKeyFrame.value);



        const direction:Vec2 = endPoint.subtract(startPoint);

        const distance:number = direction.length(); //Vec2.distance(startPoint,endPoint);
        const numSegments: number = distance / this.p2pDistance;
        const dx = direction.x / numSegments;  // x轴方向的每段增量
        const dy = direction.y / numSegments;  // y轴方向的每段增量

        const result:Vec2[] = [];

        for (let i = 0; i <= numSegments; i++) {
            const x = startPoint.x + i * dx;
            const y = startPoint.y + i * dy;
            result.push(math.v2(x, y));
        }
        return result;

        // let startP: Vec2, cP1: Vec2, cP2: Vec2, endP: Vec2;
        // let motionPath = startKeyFrame.motionPath; //移动路径数组即主控制点数组
        // let moPathSP, moPathEP; //一段曲线上的首尾端主控制点
        //
        // //第一段
        // startP = math.v2(startKeyFrame.value[0], startKeyFrame.value[1]);
        // moPathEP = motionPath[0];
        // cP1 = cP2 = math.v2(moPathEP[2], moPathEP[3]);
        // endP = math.v2(moPathEP[0], moPathEP[1]);
        // bezierPartArray.push(new BezierPart(startP, cP1, cP2, endP));
        //
        // for (let i = 0; i < motionPath.length - 1; i++) { //0 - len - 1, len - 3 len - 2 len -1
        //     moPathSP = motionPath[i];
        //     moPathEP = motionPath[i + 1]
        //     startP = math.v2(moPathSP[0], moPathSP[1]);
        //     cP1 = math.v2(moPathSP[4], moPathSP[5]);
        //     cP2 = math.v2(moPathEP[2], moPathEP[3]);
        //     endP = math.v2(moPathEP[0], moPathEP[1]);
        //     bezierPartArray.push(new BezierPart(startP, cP1, cP2, endP));
        // }
        //
        // //最后一段
        // moPathSP = motionPath[motionPath.length - 1];
        // startP = math.v2(moPathSP[0], moPathSP[1]);
        // cP1 = cP2 = math.v2(moPathSP[4], moPathSP[5]);
        // endP = math.v2(endKeyFrame.value[0], endKeyFrame.value[1]);
        // bezierPartArray.push(new BezierPart(startP, cP1, cP2, endP));

        // return bezierPartArray;
    }

    /**
     * Draws point
     * @param point 点坐标
     * @param color 默认颜色为红色
     */
    private drawPoint(point: Vec2 | Vec2[], color: Color = null) {
        this.graphics.clear();
        if (color === null)
            this.graphics.strokeColor = Color.RED;
        else
            this.graphics.strokeColor = color;

        // this.graphics.strokeColor = cc.Color.RED;
        this.graphics.fillColor = Color.RED
        this.graphics.lineWidth = 1;

        if ((<Vec2[]>point).length) {
            for (let i = 0; i < (<Vec2[]>point).length; i++) {
                this.graphics.circle(point[i].x, point[i].y, 2);
                // this.graphics.stroke();
                this.graphics.fill();
            }
        }
        else {
            this.graphics.circle((<Vec2>point).x, (<Vec2>point).y, 2);
            this.graphics.fill();
        }

    }
}
