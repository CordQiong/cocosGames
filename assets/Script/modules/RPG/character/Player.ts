import { Node, Component, _decorator, ITriggerEvent } from "cc";

import Character, { CharacterState } from "./Character";

const { ccclass, property } = _decorator;
@ccclass('Player')
export default class Player extends Character{ 
    start() {
        super.start();
    }
    public get state(): CharacterState {
        return this._state;
    }

    public set state(value: CharacterState) {
        this._state = value;

        switch (this._state) {
            case CharacterState.idle:
                if (this.skeleton) {
                    this.skeleton.setAnimation(0, "stand2", true);
                }
                break;

            case CharacterState.walk:
                // this.movieClip.begin = 6;
                // this.movieClip.end = 12;

                if (this.skeleton) {
                    this.skeleton.setAnimation(0, "run", true);
                }
                break;

            case CharacterState.sitdown:
                // this.movieClip.begin = 12;
                // this.movieClip.end = 18;
                break;

            case CharacterState.sitdown_walk:
                // this.movieClip.begin = 18;
                // this.movieClip.end = 24;
                break;

        }
    }
}