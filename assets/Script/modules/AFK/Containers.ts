import { Component, Node } from "cc";
import { HashMap } from "../../Common/maps/HashMap";
import { NodeFactory } from "../../Common/NodeFactory";
import { GameObject } from "../RPG/GameObject";

/**
 * @fileName Containers.ts
 * @author zhangqiong
 * @date 2024/12/18 16:21:40"
 * @description
 */
export class Containers extends GameObject {
    protected containerMap: HashMap<string, Node>;

    constructor() {
        super();
        this.containerMap = new HashMap<string, Node>();
    }

    protected onLoad(): void {

    }

    public getChildContainer(names: string): Node {
        if (this.containerMap.hasKey(names)) {
            return this.containerMap.get(names);
        }
        const container: Node = NodeFactory.instance.createNode();
        this.addChild(container);
        this.containerMap.put(names, container);
        return container;
    }

    public setContainers(names: string[]): void {
        for (let i = 0; i < names.length; i++) {
            const container: Node = NodeFactory.instance.createNode();
            container.name = names[i];
            this.addChild(container);
            this.containerMap.put(names[i], container);

        }
    }

    public addContainer(name: string, container: Node = null, depth: number = -1): void {
        if (this.containerMap.get(name) == null) {
            if (!container) {
                container = NodeFactory.instance.createNode();
            }
            if (depth == -1) {
                this.addChild(container);
            } else {
                container.setSiblingIndex(depth);
                this.addChild(container);
            }
            this.containerMap.put(name, container);
        }
    }

    public removeContainer(name: string): Node {
        let container: Node = this.containerMap.get(name);
        if (container) {
            this.containerMap.remove(name);
            this.removeChild(container);
            return container;
        }
        return null;
    }

    public remove(): void {
        if (this.parent)
            this.parent.removeChild(this);
    }
}