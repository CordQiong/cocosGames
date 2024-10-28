import { _decorator, Component, math, Node, Sprite, SpriteFrame, UITransform } from 'cc';
import { config } from './config';
const { ccclass, property } = _decorator;

@ccclass('Background')
export class Background extends Component {
    @property(SpriteFrame)
    itemSpriteFrame: SpriteFrame = undefined;

    itemArray: Node[][] = [];
    protected onLoad(): void {
        this.init();
    }

    init(): void {
        this.itemArray = [];
        const height: number = config.row * config.blockHeight;
        const width: number = config.col * config.blockWidth;
        for (let i = 0; i < config.row; i++) {
            this.itemArray[i] = [];
            for (let j = 0; j < config.col; j++) {
                const x: number = - width / 2 + config.blockWidth / 2 + j * config.blockWidth;
                const y: number = height / 2 - config.blockHeight / 2 - i * config.blockHeight;
                const item: Node = this.createItem(x, y);
                this.itemArray[i][j] = item;
            }
        }
        console.log(this.itemArray);
    }

    private createItem(x: number, y: number): Node {
        const item: Node = new Node();
        const sprite: Sprite = item.addComponent(Sprite);
        sprite.spriteFrame = this.itemSpriteFrame;
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;
        this.node.addChild(item);
        item.setPosition(x, y);
        item.addComponent(UITransform).contentSize = math.size(config.blockWidth, config.blockHeight);
        return item;
    }

    protected onDestroy(): void {
        for (let i = 0; i < this.itemArray.length; i++) {
            const items: Node[] = this.itemArray[i];
            for (let j = 0; j < items.length; j++) {
                const element = items[j];
                if (element) {
                    element.destroy();
                }
            }
        }
        this.itemArray = [];
    }
}


