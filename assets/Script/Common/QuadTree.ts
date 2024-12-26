import { AreaType } from "./AreaType";
import {math, Vec3} from "cc";

export enum AnchorPointType {
    Center = 0,
    LeftDown = 1
}
// QuadTreeRect.ts
export class QuadTreeRect {
    constructor(
        public x: number,
        public y: number,
        public width: number,
        public height: number
    ) { }

    // 检查目标矩形是否完全包含在当前矩形内
    contains(target: QuadTreeRect,anchorType:AnchorPointType = AnchorPointType.Center): boolean {
        let contain:boolean= false;
        if(anchorType == AnchorPointType.LeftDown){
            // 矩形 A 的边界
            const ALeft = this.x;
            const ARight = this.x + this.width;
            const ABottom = this.y;
            const ATop = this.y + this.height;

            // 矩形 B 的边界
            const BLeft = target.x;
            const BRight = target.x + target.width;
            const BBottom = target.y;
            const BTop = target.y + target.height;

            // 检查矩形 A 是否包含矩形 B
            return ALeft <= BLeft && ARight >= BRight && ABottom <= BBottom && ATop >= BTop;
        }else if(anchorType == AnchorPointType.Center){
            contain = Math.abs(target.x - this.x) + target.width / 2 <= this.width / 2 &&
                Math.abs(target.y - this.y) + target.height / 2 <= this.height / 2;
        }
        return contain;
    }

    // 检查两个矩形是否相交
    intersects(target: QuadTreeRect,anchorType:AnchorPointType = AnchorPointType.Center): boolean {
        let  intersect: boolean = false;
        if(anchorType == AnchorPointType.Center) {
            intersect = Math.abs(target.x - this.x) <= (this.width + target.width) / 2 &&
                Math.abs(target.y - this.y) <= (this.height + target.height) / 2;
        }else if(anchorType == AnchorPointType.LeftDown) {
            // 矩形 A 的边界
            const ALeft = target.x;
            const ARight = target.x + target.width;
            const ABottom = target.y;
            const ATop = target.y + target.height;

            // 矩形 B 的边界
            const BLeft = this.x;
            const BRight = this.x + this.width;
            const BBottom = this.y;
            const BTop = this.y + this.height;

            // 检查水平重叠
            const horizontalOverlap = ARight > BLeft && ALeft < BRight;

            // 检查垂直重叠
            const verticalOverlap = ATop > BBottom && ABottom < BTop;

            // 如果水平和垂直都有重叠，则两个矩形相交
            intersect = horizontalOverlap && verticalOverlap;
        }
        return intersect;
    }

    public getIsInRange(target:QuadTreeRect,radian:number,anchorType:AnchorPointType = AnchorPointType.Center):boolean {
        const targetPos:Vec3 = math.v3(target.x,target.y,0);
        const curPos:Vec3 = math.v3(this.x,this.y);
        const distance: number = Vec3.distance(curPos, targetPos);
        return  distance < radian;
    }
}

export class QuadTree<T extends { rect: QuadTreeRect }> {
    private children: (QuadTree<T> | null)[] = [null, null, null, null];
    private objects: T[] = [];
    private divided: boolean = false;
    private depth: number = 0;

    public rect: QuadTreeRect;
    private readonly MAX_COUNT: number = 10;
    private readonly MAX_DEPTH: number = 5;

    private readonly anchorPointType:AnchorPointType;

    constructor(rect: QuadTreeRect, maxCount: number = 10, maxDepth: number = 5,anchorPointType:AnchorPointType = AnchorPointType.Center) {
        this.rect = rect;
        this.MAX_COUNT = maxCount;
        this.MAX_DEPTH = maxDepth;
        this.anchorPointType = anchorPointType;
    }

    // 插入对象
    insert(object: T): boolean {
        if (!this.rect.contains(object.rect,this.anchorPointType) && !this.rect.intersects(object.rect,this.anchorPointType)) {
            return false; // 对象不在当前节点范围内
        }

        if (this.objects.length < this.MAX_COUNT) {
            this.objects.push(object);
            return true;
        }

        if (this.depth >= this.MAX_DEPTH) {
            return false; // 达到最大深度，无法分裂
        }

        if (!this.divided) {
            this.divide();
        }

        for (const child of this.children) {
            if (child?.insert(object)) {
                return true;
            }
        }

        return false;
    }

    private getTargetIndex(node: T): number {
        const X: number = this.rect.x;
        const Y: number = this.rect.y;
        const halfWidth: number = this.rect.width / 2;
        const halfHeight: number = this.rect.height / 2;
        const min_x: number = node.rect.x - node.rect.width / 2;
        const min_y: number = node.rect.y - node.rect.height / 2;
        const max_x: number = node.rect.x + node.rect.width / 2;
        const max_y: number = node.rect.y + node.rect.height / 2;

        if (min_x > X + halfWidth || max_x < X - halfWidth || min_y > Y + halfHeight || max_y < Y - halfHeight) return 0;

            let idx:number = 0;
            let IsLeft: boolean = min_x <= X ? true : false;
            let IsRight:boolean = max_x >= X ? true : false;
            let  IsBottom:boolean = min_y <= Y ? true : false;
            let IsTop:boolean = max_y >= Y ? true : false;

        if (IsLeft) {
            if (IsTop) idx |= AreaType.LT;
            if (IsBottom) idx |= AreaType.LB;
        }
        if (IsRight) {
            if (IsTop) idx |= AreaType.RT;
            if (IsBottom) idx |= AreaType.RB;
        }
        return idx;
    }

    // 分裂当前节点为四个象限
    private divide(): void {
        const { x, y, width, height } = this.rect;
        const halfWidth = width / 2;
        const halfHeight = height / 2;

        const half2Width: number = halfWidth / 2;
        const half2Height: number = halfHeight / 2;

        if(this.anchorPointType == AnchorPointType.Center){
            this.children[0] = new QuadTree(
                new QuadTreeRect(x - half2Width, y + half2Height, halfWidth, halfHeight),
                this.MAX_COUNT,
                this.MAX_DEPTH
            );
            this.children[1] = new QuadTree(
                new QuadTreeRect(x + half2Width, y + half2Height, halfWidth, halfHeight),
                this.MAX_COUNT,
                this.MAX_DEPTH
            );
            this.children[2] = new QuadTree(
                new QuadTreeRect(x - half2Width, y - half2Height, halfWidth, halfHeight),
                this.MAX_COUNT,
                this.MAX_DEPTH
            );
            this.children[3] = new QuadTree(
                new QuadTreeRect(x + half2Width, y - half2Height, halfWidth, halfHeight),
                this.MAX_COUNT,
                this.MAX_DEPTH
            );
        }else if(this.anchorPointType == AnchorPointType.LeftDown){
            this.children[0] = new QuadTree(
                new QuadTreeRect(x , y + halfHeight, halfWidth, halfHeight),
                this.MAX_COUNT,
                this.MAX_DEPTH,
                this.anchorPointType
            );
            this.children[1] = new QuadTree(
                new QuadTreeRect(x + halfWidth, y + halfHeight, halfWidth, halfHeight),
                this.MAX_COUNT,
                this.MAX_DEPTH,
                this.anchorPointType
            );
            this.children[2] = new QuadTree(
                new QuadTreeRect(x, y , halfWidth, halfHeight),
                this.MAX_COUNT,
                this.MAX_DEPTH,
                this.anchorPointType
            );
            this.children[3] = new QuadTree(
                new QuadTreeRect(x + halfWidth, y , halfWidth, halfHeight),
                this.MAX_COUNT,
                this.MAX_DEPTH,
                this.anchorPointType
            );
        }



        this.divided = true;
        this.depth++;
    }

    // 查询指定范围内的对象
    query(range: QuadTreeRect, found: T[] = []): T[] {
        if (!this.rect.contains(range,this.anchorPointType)&& !this.rect.intersects(range,this.anchorPointType)) {
            return found; // 范围不在当前节点内
        }

        for (const obj of this.objects) {
            if (range.intersects(obj.rect,this.anchorPointType)) {
                found.push(obj);
            }
        }

        if (this.divided) {
            for (const child of this.children) {
                if (child) {
                    child.query(range, found);
                }
            }
        }

        return found;
    }

    queryInRange(range:QuadTreeRect,radian:number,found:T[] = []): T[] {
        if (!this.rect.contains(range,this.anchorPointType)) {
            return found; // 范围不在当前节点内
        }

        for (const obj of this.objects) {
            if(range.getIsInRange(obj.rect,radian,this.anchorPointType)){
                found.push(obj);
            }
        }
        if (this.divided) {
            for (const child of this.children) {
                if (child) {
                    child.queryInRange(range,radian, found);
                }
            }
        }
        return found;
    }
    public getAllChildNodes(qtList: QuadTree<T>[]) {
        qtList.push(this);
        for (let i = 0; i < this.children.length; ++i) {
            const child = this.children[i];
            if (child) {
                child.getAllChildNodes(qtList);
            }
        }
    }

    clear(): void {
        // 清除当前节点存储的对象
        this.objects.length = 0;

        // 递归清除子节点
        for (let i = 0; i < this.children.length; i++) {
            if (this.children[i]) {
                this.children[i].clear(); // 递归清除子节点
                this.children[i] = null; // 释放子节点
            }
        }

        // 重置分裂状态
        this.divided = false;
        this.depth = 0;
    }

    public remove(node:T):boolean{
        let isRemove = false;
        if(!this.rect.contains(node.rect,this.anchorPointType) && !this.rect.intersects(node.rect,this.anchorPointType)) {
            return isRemove;
        }

        const index:number = this.objects.indexOf(node);
        if(index > -1){
            this.objects.splice(index, 1);
            isRemove = true;
        }
        for (let i = 0; i < this.children.length; i++) {
            if (this.children[i]) {
                this.children[i].remove(node); // 递归清除子节点
            }
        }
        return isRemove;
    }
}
