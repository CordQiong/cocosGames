import { EventKeyboard, NodePool } from "cc";
import RoadNode from "./RoadNode";

export default class BinaryTreeNode {
    public seekTag: number = 0;
    
    public openNode: RoadNode = null ;

    public count: number = 0;

    public refleshTag(): void{
        this.openNode = null;
        this.count = 0;
        this.seekTag++;
        if (this.seekTag > 1000000000) {
            this.seekTag = 0;
        }
    }

    public isTreeNull(): boolean{
        return this.openNode == null;
    }

    public addTreeNode(roadNode: RoadNode, head: RoadNode = null): void{
        this.count++;
        if (head == null) {
            if (this.isTreeNull()) {
                this.openNode = roadNode;
                return;
            } else {
                head = this.openNode;
            }
        }

        if (head == roadNode) {
            return;
        }

        if (roadNode.f >= head.f) {
            if (head.right == null) {
                head.right = roadNode;
                roadNode.treeParent = head;
            } else {
                this.addTreeNode(roadNode, head.right);
            }
        } else {
            if (head.left == null) {
                head.left = roadNode;
                roadNode.treeParent = head;
            } else {
                this.addTreeNode(roadNode, head.left);
            }
        }

    }

    public removeTreeNode(roadNode: RoadNode): void{
        this.count++;
        if (roadNode.treeParent == null && roadNode.left == null && roadNode.right == null) {
            if (roadNode == this.openNode) {
                this.openNode = null;
            }

            return;
        }
        if (roadNode.treeParent == null) {
            if (roadNode.left) {
                this.openNode = roadNode.left;
                roadNode.left.treeParent = null;

                if (roadNode.right) {
                    roadNode.right.treeParent = null;
                    this.addTreeNode(roadNode.right, this.openNode);
                }
            } else if (roadNode.right) {
                this.openNode = roadNode.right;
                roadNode.right.treeParent = null;
            }
        } else {
            if (roadNode.treeParent.left == roadNode) {
                if (roadNode.right) {
                    roadNode.treeParent.left = roadNode.right;
                    roadNode.right.treeParent = roadNode.treeParent;

                    if (roadNode.left) {
                        roadNode.left.treeParent = null;
                        this.addTreeNode(roadNode.left, roadNode.right);
                    }
                } else {
                    roadNode.treeParent.left = roadNode.left;
                    if (roadNode.left) {
                        roadNode.left.treeParent = roadNode.treeParent;
                    }
                }
            } else if (roadNode.treeParent.right == roadNode) {
                if (roadNode.left) {
                    roadNode.treeParent.right = roadNode.left;
                    roadNode.left.treeParent = roadNode.treeParent;

                    if (roadNode.right) {
                        roadNode.right.treeParent = null;
                        this.addTreeNode(roadNode.right, roadNode.left);
                    }
                } else {
                    roadNode.treeParent.right = roadNode.right;
                    if (roadNode.right) {
                        roadNode.right.treeParent = roadNode.treeParent;
                    }
                }
            }
        }

        roadNode.resetTree();
    }

    public getMinFNode(head: RoadNode = null): RoadNode{
        this.count++;
        if (head == null) {
            if (this.openNode == null) {
                return null;
            } else {
                head = this.openNode;
            }
        }

        if (head.left == null) {
            let minNode: RoadNode = head;
            if (head.treeParent == null) {
                this.openNode = head.right;
                if (this.openNode) {
                    this.openNode.treeParent = null;
                }
            } else {
                head.treeParent.left = head.right;
                if (head.right) {
                    head.right.treeParent = head.treeParent;
                }
            }
            return minNode;
        } else {
            return this.getMinFNode(head.left);
        }

    }

    public setRoadNodeInOpenList(node: RoadNode): void{
        node.openTag = this.seekTag;
        node.closeTag = 0;
    }

    public setRoadNodeInCloseList(node: RoadNode): void{
        node.openTag = 0;
        node.closeTag = this.seekTag;
    }

    public isInOpenList(node: RoadNode): boolean{
        return node.openTag == this.seekTag;
    }

    public isInCloseList(node: RoadNode): boolean{
        return node.closeTag == this.seekTag;
    }

    public getOpenList(): RoadNode[]{
        let openList: RoadNode[] = [];
        
        this.seachTree(this.openNode, openList);
        return openList;
    }

    public seachTree(head: RoadNode, openList: RoadNode[]): void{
        if (head == null) {
            return;
        }
        openList.push(head);

        if (head.left) {
            this.seachTree(head.left, openList);
        }
        if (head.right) {
            this.seachTree(head.right, openList);
        }
    }
}