import { Node } from "cc";

/**
 * @fileName DepthHelper.ts
 * @author zhangqiong
 * @date 2024/12/23 16:45:54"
 * @description
 */
export interface IDepthHelper {
    layerName: string;
    setTarget(target: Node): void;
    start(delay: number): void;
    stop(): void;
    update(): void;
    addChild(child: Node): void;
    removeChild(child: Node): void;
    destory(): void;
}