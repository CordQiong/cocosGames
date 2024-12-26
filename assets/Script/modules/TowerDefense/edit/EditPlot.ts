import {_decorator, CCBoolean, Component, Node, SpriteFrame} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EditPlot')
export class EditPlot extends Component {
    @property(CCBoolean)
    public canBuild:boolean = true;

    @property(SpriteFrame)
    public defaultObj:SpriteFrame = null;
    start() {

    }

    update(deltaTime: number) {
        
    }
}
