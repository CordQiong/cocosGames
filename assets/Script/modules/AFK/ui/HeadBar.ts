import { _decorator, Component, Label, Node, ProgressBar } from 'cc';
import Utils from '../../../Common/Utils';
import { FightHeroInfo } from '../infos/FightHeroInfo';
const { ccclass, property } = _decorator;

@ccclass('HeadBar')
export class HeadBar extends Component {

    private hpPro: ProgressBar;
    private mpPro: ProgressBar;
    private nameLabel: Label;
    protected onLoad(): void {
        this.hpPro = Utils.FindChildByName(this.node, "hp").getComponent(ProgressBar);
        this.mpPro = Utils.FindChildByName(this.node, "mp").getComponent(ProgressBar);
        this.nameLabel = Utils.FindChildByName(this.node, "name").getComponent(Label);
    }
    start() {

    }


    public setName(name: string): void {
        this.nameLabel.string = name;
    }

    public setData(hero: FightHeroInfo): void {
        this.updateHp(hero.hp / hero.maxHp);
        this.updateMp(hero.mp / hero.maxMp);
    }

    updateHp(progress: number): void {
        this.hpPro.progress = progress;
    }

    updateMp(progress: number): void {
        this.mpPro.progress = progress;
    }

    update(deltaTime: number) {

    }
}


