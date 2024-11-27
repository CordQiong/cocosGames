
import { Node, Component, _decorator } from "cc";

const { ccclass, property } = _decorator;

@ccclass("EntityLayer")
export default class EntityLayer extends Component{
    protected update(dt: number): void {
        this.sortZindex();
    }

    private sortZindex() {
        var allEntityNodes: Node[] = this.node.children.slice();

        allEntityNodes.sort((node1: Node, node2: Node): number => {
            if (node1.position.y > node2.position.y) {
                return -1
            } else if (node1.position.y < node2.position.y) {
                return 1;
            }

            return 0;
        });

        var entiryCount: number = allEntityNodes.length;
        for (var i = 0; i < entiryCount; i++) {
            //allEntityNodes[i].zIndex = i;
            allEntityNodes[i].setSiblingIndex(i);
        }
    }
}