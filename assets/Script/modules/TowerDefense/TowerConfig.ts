import { _decorator, JsonAsset, resources } from 'cc';
import { TowerLauncher } from "db://assets/Script/modules/TowerDefense/TowerLauncher";
import { TowerDataDTO } from './info/TowerDataDTO';
import {TowerMapDTO} from "db://assets/Script/modules/TowerDefense/info/TowerMapDTO";

const { ccclass, property } = _decorator;


export class TowerConfig {
    private static _instance: TowerConfig;
    public static get instance(): TowerConfig {
        if (!TowerConfig._instance) {
            TowerConfig._instance = new TowerConfig();
        }
        return TowerConfig._instance;
    }

    private _config: any = null;

    private _towerData: { [key: number]: { [key: string]: TowerDataDTO } };
    private _mapData: { [key: number]: { [key: string]: TowerMapDTO } };
    public constructor() {
        this.init();
    }

    private init(): void {

    }

    public loadConfig(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            resources.load("tower/config", (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(data);
            })
        })
    }

    public initConfig(config: JsonAsset): void {
        this._config = config.json;
        this._towerData = {};
        this._mapData   = {};
        const towersData = this._config["towers"];
        if (towersData) {
            for (let key in towersData) {
                const towerId: number = Number(key);
                const towrData = towersData[key];
                let idDtoMap = this._towerData[towerId];
                if (!idDtoMap) {
                    idDtoMap = {};
                }
                for (const levelKey in towrData) {
                    if (Object.prototype.hasOwnProperty.call(towrData, levelKey)) {
                        const element = towrData[levelKey];
                        const dto: TowerDataDTO = new TowerDataDTO();
                        dto.buildCost = element.buildCost;
                        dto.removeBack = element.removeBack;
                        dto.harm = element.harm;
                        dto.speed = element.speed;
                        idDtoMap[levelKey] = dto;
                    }
                }
                this._towerData[towerId] = idDtoMap;
            }
        }
        const themeConfigs = this._config["theme"];
        for (let key in themeConfigs) {
            const theme:number = Number(key);
            let themeData = this._mapData[theme];
            if(!themeData) {
                themeData = {};
            }                                                           
            const configData = themeConfigs[key];
            if (!configData) {
                continue;
            }
            for (const configDataKey in configData) {
                const mapConfig = configData[configDataKey];
                const mapData: TowerMapDTO = new TowerMapDTO()
                mapData.canBuildTowerIds = mapConfig.towers;
                mapData.startValue = mapConfig.startValue;
                mapData.enemyCount  = mapConfig.enemyCount;
                themeData[configDataKey] = mapData;
            }
            this._mapData[theme] = themeData;
        }
        // TowerLauncher.instance.value = this._config["startValue"];
        const mapData = this.getMapData();
        if (mapData) {
            TowerLauncher.instance.value = mapData.startValue
        }
    }

    public getConfig(key: string): any {
        if (!this._config) {
            return null;
        }
        return this._config[key];
    }

    public getMapData(themeId: number = TowerLauncher.instance.theme, mapId: number = TowerLauncher.instance.mapId): TowerMapDTO {
        if (!this._mapData) {
            return null;
        }
        const themeConfigs = this._mapData[themeId];
        if (!themeConfigs) {
            return null;
        }
        const theme = themeConfigs[`map${mapId}`];
        return theme
    }

    public getTowerConfig(towerId: number, level: number = 1): TowerDataDTO {
        if (!this._towerData) {
            return null;
        }
        const towerData = this._towerData[towerId];
        if (!towerData) {
            return null;
        }
        return towerData[`level${level}`]
    }
}
