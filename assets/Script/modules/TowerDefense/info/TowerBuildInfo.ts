import { _decorator, Component, Node } from 'cc';
import RoadNode from "db://assets/Script/modules/RPG/map/RoadNode";
import { TowerCharacter } from "db://assets/Script/modules/TowerDefense/TowerCharacter";
const { ccclass, property } = _decorator;

@ccclass('TowerBuildInfo')
export class TowerBuildInfo extends Component {

    public road: RoadNode;

    public selectedTowerId: number;
    public removeBackCost: number;
    public upLevelCost: number;

    public get id(): string {
        if (!this.road) {
            return null;
        }
        return `${this.road.cx}_${this.road.cy}`;
    }

    public tower: TowerCharacter;
    start() {

    }

    update(deltaTime: number) {

    }
}

