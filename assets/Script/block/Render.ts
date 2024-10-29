import { _decorator, Component, instantiate, math, Node, Prefab, Sprite, SpriteFrame, UITransform, Vec2 } from 'cc';
import { config } from './config';
import { ItemColor } from './enum';
import { Block } from './Block';
const { ccclass, property } = _decorator;

@ccclass('Render')
export class Render extends Component {

    @property(Prefab)
    item: Prefab = undefined;

    @property([SpriteFrame])
    itemSpriteFrame: SpriteFrame[] = [];

    @property(SpriteFrame)
    backGroundItemSpriteFrame: SpriteFrame = undefined;

    @property(Node)
    gamePanel: Node = undefined;
    @property(Node)
    backgroundPanel: Node = undefined;

    itemArray: Node[][] = [];
    backGroundArray: Node[][] = [];

    protected onLoad(): void {

    }

    public init(): void {
        this.itemArray = [];
        this.backGroundArray = [];
        const height: number = config.row * config.blockHeight;
        const width: number = config.col * config.blockWidth;
        const panelWidth: number = 740;
        const panelHeight: number = 1334;
        const diffH: number = Math.max(panelHeight - height, 0);
        for (let i = 0; i < config.row; i++) {
            this.itemArray[i] = [];
            this.backGroundArray[i] = [];
            for (let j = 0; j < config.col; j++) {
                const x: number = - width / 2 + config.blockWidth / 2 + j * config.blockWidth;
                const y: number = height / 2 - config.blockHeight / 2 - i * config.blockHeight - diffH / 2;
                let backItem: Node = this.backGroundArray[i][j];
                if (!backItem) {
                    backItem = this.createBackGroundItem(x, y)
                }
                backItem.getComponent(Sprite).spriteFrame = this.backGroundItemSpriteFrame;
                this.backGroundArray[i][j] = backItem;
                let item: Node = this.itemArray[i][j]
                if (!item) {
                    item = this.createItem(x, y);
                }
                this.itemArray[i][j] = item;
            }
        }
    }

    private createBackGroundItem(x: number, y: number): Node {
        const item: Node = new Node();
        const sprite: Sprite = item.addComponent(Sprite);
        sprite.spriteFrame = this.backGroundItemSpriteFrame;
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;
        this.node.addChild(item);
        item.setPosition(x, y);
        item.addComponent(UITransform).contentSize = math.size(config.blockWidth, config.blockHeight);
        return item;
    }

    public createItem(x: number, y: number): Node {
        const item: Node = instantiate(this.item);
        this.gamePanel.addChild(item);
        item.getComponent(Sprite).sizeMode = Sprite.SizeMode.CUSTOM;
        item.getComponent(UITransform).contentSize = math.size(config.blockWidth, config.blockHeight);
        item.setPosition(x, y);
        return item;
    }

    public render(dataArray: ItemColor[][]): void {
        for (let i = 0; i < config.row; i++) {
            for (let j = 0; j < config.col; j++) {
                const color: ItemColor = dataArray[i][j];
                this.itemArray[i][j].getComponent(Sprite).spriteFrame = this.itemSpriteFrame[color - 1];
            }

        }
    }

    protected onDestroy(): void {
        for (let index = 0; index < this.itemArray.length; index++) {
            const elements = this.itemArray[index];
            for (let j = 0; j < elements.length; j++) {
                const element = elements[j];
                if (element) {
                    element.destroy();
                }
            }
        }
        this.itemArray = [];
    }

    public playEliminateEff(eliminateVec2: Vec2[]): Promise<any> {
        return new Promise((resolve, reject) => {
            let result: number = 0;
            for (let i = 0; i < eliminateVec2.length; i++) {
                const v2 = eliminateVec2[i];
                let block: Block = this.itemArray[v2.x][v2.y].getComponent(Block);
                if (block) {
                    block.playEff().then((r: boolean) => {
                        if (r) {
                            result += 1;
                            if (result == eliminateVec2.length) {
                                resolve(true);
                            }
                        }
                    });
                }
            }

        })
    }
}


