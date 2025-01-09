import { error, math, Node, randomRangeInt, sp, sys, Vec3 } from "cc";
import { SpineSkeleton } from "../../../Common/SpineSkeleton";
import { FightHeroInfo } from "../infos/FightHeroInfo";
import { Entity } from "./Entity";
import { GameEntity } from "./GameEntity";
import { RoleEntity } from "./RoleEntity";
import { FightMgr } from "./FightMgr";
import { FightUtil } from "./FightUtil";
import { GameConst } from "../GameConst";
import { FightSkillInfo } from "../infos/FightSkillInfo";
import { HeadBar } from "../ui/HeadBar";
import AssetMgr from "../../../Common/AssetMgr";
import ViewConst from "../../../ui/ViewConst";
import { Handler } from "../../../Common/Handler";

/**
 * @fileName FightRoleEntity.ts
 * @author zhangqiong
 * @date 2024/12/26 20:40:29"
 * @description
 */
export class FightRoleEntity extends RoleEntity {

    protected isAI: boolean = false;
    public isDie: boolean = false;

    private isFight: boolean = false;

    private selectTargets: FightRoleEntity[] = [];

    protected selectMainTarget: FightRoleEntity = null;
    public skillInfo: FightSkillInfo = null;

    protected isUseCtrSkill: boolean = false;

    private headBar: HeadBar = null;

    private isWin: boolean = false;

    constructor() {
        super();
    }

    public updateHeadPos(): void {
        if (this.headBar) {
            let pos: Vec3 = this.getLocation();
            let bounds: number[] = this.getBounds()
            const x: number = pos.x;
            const y: number = pos.y;
            let height: number = bounds[3];
            let yy: number = height + y;
            this.headBar.node.setPosition(x, yy);
            // this.head.y = yy + this.role.y;
        }
    }

    public async initHeadBar(): Promise<void> {
        const node: Node = await AssetMgr.instance.createPrefab(ViewConst.defaultPrefabPathPrefix + "afk/headBar");
        if (!node) {
            console.log("加载预制体失败");
            return;
        }
        this.headBar = node.getComponent(HeadBar);
        var container: Node = this.mScene.getChildContainer(GameConst.ROLE_NAME_LAYER);
        node.parent = container;
        this.updateHeadPos();
        this.updateHeadInfo();
    }

    private updateHeadInfo(): void {
        if (this.data && this.headBar) {
            this.headBar.setName(`${this.data.site}_${this.data.camp == 0 ? "队友" : "敌人"}_${this.data.heroConfig.spineId}`);
            this.headBar.setData(this.data);
        }
    }

    public async setData(hero: FightHeroInfo): Promise<void> {
        super.setData(hero);
        this.isAI = true;
        // if (hero.camp == 1) {
        //     this.isAI = true;
        // }
    }

    protected nextRoleFrame(): void {
        this.nextPlayerFrame();
        this.move();
    }

    protected move(): void {
        this.setSpeed(this.data.heroConfig.speed);
        super.move();
    }


    public check(isMustActiveSkill: boolean = false): void {

        this.nextRoleFrame();

        if (this.isDie || this.isWin) {
            return;
        }
        this.data.fightSkills.nextFrame();
        //攻击中而且无按到释放主动技能的标记就不执行下面的动作
        if (this.isFight && !this.isUseCtrSkill && !isMustActiveSkill) {
            return;
        }

        if (isMustActiveSkill) {
            //强制手动主动技的话，强制设置一下
            this.isUseCtrSkill = true;
            this.isFight = true;
        }
        this.checkSkill(isMustActiveSkill);
        this.checkSelectTarget();
        this.attack();
    }

    public canSelect(): boolean {
        return !this.isDie && !this.isRemoveTime;
    }

    public canAttack(): boolean {
        return true;
    }

    public checkSelectTarget(): void {

        if (this.skillInfo) {
            //有技能的时候才判断选择目标
            if (this.selectTargets.length == 0) {
                //无目标时选择最近的目标
                this.onNotSelectTarget();
            }
            else {
                this.onHasSelectTarget();
            }
        }

    }

    /***有目标时的选择方式*/
    protected onHasSelectTarget(): void {
    }

    /***无目标时的选择方式 */
    protected onNotSelectTarget(): void {
        //其他的话，则按照当前技能特效来变化目标\
        let targets = this.skillInfo.cfg.targetTypes

        // let isSelect = this.skillInfo.skillEffects[0].skillEffCfg.pz_selectTarget;//是否忽略不可选中
        this.selectTargets = FightMgr.instance.findEntity(this, targets);
        if (this.selectTargets.length == 0) {
            if (targets[0] == GameConst.MiJi) {
                //最密集找不到就普攻
                this.skillInfo = this.data.fightSkills.getSkillByIndex(0);
            }
            else if (targets[0] != GameConst.MaxMp) {
                //无目标的时候，选最近的
                var tempTargets: number[] = targets.concat();
                tempTargets[0] = GameConst.DangQianMuBiao
                this.selectTargets = FightMgr.instance.findEntity(this, tempTargets);
            }

            if (this.selectTargets.length == 0) {
                this.onSelectTargetNull();
            }
        }

    }

    /***在技能选中后还是找不到目标，默认是处理使用掉这个技能 */
    protected onSelectTargetNull(): void {
        //还是空的，那就当使用了这个技能了
        this.data.fightSkills.useSkill(this.skillInfo.skillId);
        this.skillInfo = null;
    }

    protected checkSkillMainTarget(): void {
        if (this.selectTargets.length == 0) {
            if (this.selectMainTarget) {
                //有目标是要判断目标是否不可选中
                if (!this.selectMainTarget.canSelect())
                    this.clearMainTarget()
            }

            if (!this.selectMainTarget || this.skillInfo.cfg.target != GameConst.Main_DangQianMuBiao) {
                //当前无目标，或者技能要改变主目标的时候才会切换
                this.selectMainTarget = FightMgr.instance.findMainEntity(this, this.skillInfo.cfg.target)[0];
            }
        }
    }

    public clearMainTarget(): void {
        this.selectMainTarget = null;
    }

    /***是否能检测主动技能的释放条件 */
    protected canCheckAngerSkill(): boolean {
        if (this.isUseCtrSkill || this.isAI) {
            return true
        }
        return false
    }

    public canUseAngerSkill(): boolean {
        if (!this.canMove())
            return false;

        return this.data.mp >= this.data.maxMp;
    }

    protected selectAngerSkill(): FightSkillInfo {
        return this.data.fightSkills.checkAiToCtrAngerSkill(this);
    }

    protected selectAngerCheckSelectTarget(): void {
        this.selectTargets.length = 0;
    }

    public checkPassSkillBySkillCheck(from: FightRoleEntity): void {
        // FightFormula_SHM_0593.checkPassSkillCon(PassivitySkillType_SHM_8879.ConType_31, this, from_SHM_5537)
    }

    protected selectSkill(): FightSkillInfo {
        // return null;
        return this.data.fightSkills.selectSkill(this);
    }

    /***检测选中的技能 */
    protected checkSkill(isMustActiveSkill: boolean = false): void {
        if (this.skillInfo && !this.isUseCtrSkill && !isMustActiveSkill) {
            //已经选择了技能就进行移动方式释放技能
            this.checkSkillMainTarget();
            return;
        }

        if (this.canCheckAngerSkill() || isMustActiveSkill) {
            //ai控制主动技能
            if (this.canUseAngerSkill() || isMustActiveSkill) {
                //mp足够
                this.skillInfo = this.selectAngerSkill();
                if (this.skillInfo) {
                    this.selectAngerCheckSelectTarget();
                }
            }
        }

        if (!this.skillInfo) {
            //优先判断主动技能存在就跳过这个被动的检测了
            this.checkPassSkillBySkillCheck(this);

            //主动技能无选择才选择一个自动技能释放
            this.skillInfo = this.selectSkill();
            if (!this.skillInfo)
                return
        }
        //选择技能后看情况重新锁定主要目标
        this.checkSkillMainTarget();
    }

    protected checkAttack(isIgnoreDis: boolean = false): boolean {
        if (!this.canMove()) {
            return false;
        }
        if (!this.canAttack()) {
            return false;
        }
        if (!isIgnoreDis) {
            const targetPos: Vec3 = this.selectTargets[0] ? this.selectTargets[0].getLocation() : math.v3(0, 0);
            // const targetPos: Vec3 = FightUtil.instance.getScenceRandomPosition();
            let formPos: Vec3 = this.getLocation();
            this.targetMovePoint = FightUtil.instance.getTargetPointByDis(targetPos, formPos, this.skillInfo.cfg.distance);
            if (this.targetMovePoint) {
                this.moveAngle = FightUtil.instance.getAngleByVec(this.x, this.y, this.targetMovePoint.x, this.targetMovePoint.y);
                this.changeDirByAngle(this.moveAngle);
                return false;
            }
        }
        return true;
    }

    protected attack(): void {
        if (this.selectTargets.length == 0) {
            // console.error(`${this.data.heroConfig.spineId}没有找到攻击对象`);
            return;
        }
        //没有技能
        if (!this.skillInfo) {
            // console.error(`${this.data.heroConfig.spineId}没有找到攻击对象`);
            return;
        }


        if (this.isFight && this.skillInfo.cfg.type != GameConst.Skill_Active)//攻击中就不执行下面的动作，主动技是可以打断的
            return;

        if (!this.checkAttack()) {
            return;
        }

        this.data.fightSkills.useSkill(this.skillInfo.skillId);
        if (this.skillInfo.cfg.type == GameConst.Skill_Active) {
            //AI控制的主动技能消耗MP
            this.data.useMp();
            this.headBar.updateMp(this.data.mp / this.data.maxMp);
            this.isUseCtrSkill = false;
        }
        this.stopAction();
        this.startAttackAction(this.skillInfo, this.selectTargets)
    }

    private getTenThousandPlaceValue(num: number) {
        // 确保输入是数字
        if (typeof num !== 'number' || !Number.isFinite(num)) {
            throw new Error('请输入一个有效的数字');
        }

        // 转为整数并取万位值
        const tenThousandPlaceValue = Math.floor(Math.abs(num) / 10000) % 10;

        return tenThousandPlaceValue;
    }

    public async startAttackAction(skillInfo: FightSkillInfo, target: FightRoleEntity[]) {
        console.log(`第${FightMgr.instance.index}帧,攻击者：${this.data.spineId}发起技能${skillInfo.skillId}攻击了`)
        this.fightStart();
        this.setSpineKeyFrameHandler(Handler.create(this.onSpineKeyFrame, this))
        let type: number = this.getTenThousandPlaceValue(skillInfo.skillId);
        let action: string = type == 1 ? GameConst.Attack : GameConst.Ultimateskill;
        await this.setAction(action, 1);

        for (let index = 0; index < target.length; index++) {
            const e: FightRoleEntity = target[index];
            // await e.setAction(GameConst.BeHit, 1, null)
            // e.fightEnd();
            e.hurt(skillInfo.cfg.hurt, this);
            e.recovery(skillInfo.cfg.recoveyAnger, this);
        }
        this.fightEnd();

    }

    private onSpineKeyFrame(entry: sp.spine.TrackEntry, event: sp.spine.Event): void {
        // console.log("触发事件", event.data.name, event.intValue, event.floatValue, event.stringValue)

    }

    protected fightStart(): void {
        this.isFight = true;
    }

    protected fightEnd(): void {
        this.isFight = false;
        this.skillInfo = null;
        this.selectTargets.length = 0;
    }


    public hurt(hurtValue: number, form: FightRoleEntity): void {
        this.data.hp = this.data.hp - hurtValue;
        this.headBar.updateHp(this.data.hp / this.data.maxHp);
        if (this.data.hp <= 0) {
            this.die();
        }
    }

    public recovery(value: number, form: FightRoleEntity): void {
        this.data.mp += value;
        this.headBar.updateMp(this.data.mp / this.data.maxMp);
    }

    public setIsWin(win: boolean): void {
        this.isWin = win;
        if (win) {
            this.setAction(GameConst.Win);
        }
    }


    public async die(): Promise<void> {
        this.stopAction();
        FightMgr.instance.entityToDie(this);
        await this.setAction(GameConst.Death)
        this.active = false;
        if (this.headBar)
            this.headBar.node.active = false;
        this.isDie = true;
    }
}