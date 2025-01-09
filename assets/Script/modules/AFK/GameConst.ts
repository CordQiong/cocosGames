/**
 * @fileName GameConst.ts
 * @author zhangqiong
 * @date 2024/12/26 15:19:25"
 * @description
 */
export class GameConst {
    public static Attack: string = "att";
    public static Idle: string = "holdon";
    public static Move: string = "move";
    public static Skill: string = "skill";
    public static Ultimateskill: string = "ultimateskill"
    public static BeHit: string = "behit";
    public static Death: string = "death";
    public static Win: string = "win";


    static UP: number = 0;
    static RIGHT_UP: number = 1;
    static RIGHT: number = 2;
    static RIGHT_DOWN: number = 3;
    static DOWN: number = 4;
    static LEFT_DOWN: number = 5;
    static LEFT: number = 6;
    static LEFT_UP: number = 7;


    /** 北 上 **/
    static N: number = 0;
    /** 右上**/
    static NE: number = 1;
    /** 东 右 **/
    static E: number = 2;
    /** 右下**/
    static ES: number = 3;
    /** 南  下**/
    static S: number = 4;
    /**左下**/
    static SW: number = 5;
    /** 西 左 **/
    static W: number = 6;
    /** 左上**/
    static WN: number = 7;


    /** 背景层 **/
    static BG_LAYER: string = "bgContainer";
    /** 地图层 **/
    static MAP_Bottom_Role_LAYER: string = "bottomRoleContainer";
    /** 地图层 **/
    static MAP_LAYER: string = "mapContainer";
    /** 地图装饰层 **/
    static DECORATE_LAYER: string = "decorateContainer";
    /** 影子层 **/
    static MAP_SHADOW_LAYER: string = "shadowContainer";
    /** 脚底特效层 **/
    static MAP_MAGIC_LAYER: string = "magicContainer";
    /** 地图特效层 **/
    static MAP_EFFECT_LAYER: string = "mapEffectContainer";
    /** 掉落层 **/
    static MAP_DROP_LAYER: string = "dropContainer";
    /** 特效层 **/
    static EFFECT_Bottom_LAYER: string = "effectBottomContainer";
    /** 红白特效层 **/
    static EFFECT_TOP_LAYER: string = "effectTopContainer";
    /** 角色层 **/
    static ROLE_LAYER: string = "roleContainer";
    /** 角色遮罩层 **/
    static ROLE_NAME_LAYER: string = "roleNameContainer";
    /** 特效层 **/
    static EFFECT_LAYER: string = "effectContainer";
    /** 受击特效层 **/
    static HIT_EFFECT_LAYER: string = "hitEffectLayer";
    /** 飘血层层 **/
    static HURT_EFFECT_LAYER: string = "hurtContainer";
    /** 中间层 **/
    static CENTER_LAYER: string = "centerContainer";
    /** 前景层 **/
    static TOP_LAYER: string = "topContainer";

    // 主目标
    /**当前主目标 */
    public static Main_DangQianMuBiao: number = 1;
    /**血百分比最低主目标 */
    public static Main_XueBaiFenZuiDi: number = 2;
    /**血百分比最高主目标 */
    public static Main_XueBaiFenZuiGao: number = 3;
    /**距离最远主目标 */
    public static Main_JuLiZuiYuan: number = 4;
    /**距离最近主目标 */
    public static Main_JuLiZuiJin: number = 5;
    /**初始对称位置主目标 */
    public static Main_ChuShiDuiChengWeiZhi: number = 6;

    //临时目标  一般配置在技能表中
    /**当前目标 */
    public static DangQianMuBiao: number = 1;
    /**全体 */
    public static QuanTi: number = 2;
    /**战力最高 */
    public static ZhanLiZuiGao: number = 3;
    /**攻击最高 */
    public static GongJiZuiGao: number = 4;
    /**血百分比最低 */
    public static XueBaiFenZuiDi: number = 5;
    /**血百分比最高 */
    public static XueBaiFenZuiGao: number = 6;
    /**距离最远 */
    public static JuLiZuiYuan: number = 7;
    /**距离最近 */
    public static JuLiZuiJin: number = 8;
    /**初始对称位置 */
    public static ChuShiDuiChengWeiZhi: number = 9;
    /**最靠前 */
    public static ZuiKaoQian: number = 10;
    /**最靠后 */
    public static ZuiKaoHou: number = 11;
    /**前排 */
    public static QianPai: number = 12;
    /**后排 */
    public static HouPai: number = 13;
    /**随机不可重复 */
    public static SuiJiBuKeChongFu: number = 14;
    /**随机可重复 */
    public static SuiJiKeChongFu: number = 15;
    /**最密集的地方 */
    public static MiJi: number = 16;
    /**最低防 */
    public static FangYuDi: number = 17;
    /**指定英雄（光环） */
    public static ZhiDingYingXiong: number = 18;
    /**最前没有盾 */
    public static FontNotDun: number = 19;
    /**拥有某个BUFF */
    public static Buff: number = 20;
    /**血量最低 */
    public static XueZuiDi: number = 21;
    /**血量最高 */
    public static XueZuiGao: number = 22;
    /**按攻击类型选取（1物理，2法术） */
    public static GongJiLeiXing: number = 23;
    /**角度最小,取的纵坐标相差最小的绝对值 */
    public static JiaoDuZuiXiao: number = 24;
    /**角度最小,指定职业 */
    public static Job: number = 25;
    /**能量最高排除已满 */
    public static MaxMp: number = 26;
    /**指定阵营 */
    public static ZhiDingZhenYing: number = 27;
    /**自己 */
    public static Ziji: number = 28;
    /**威胁最大 */
    public static WeiXieZuiDa: number = 29;
    /**最靠近我方半场的横坐标最小的目标 */
    public static ZuiKaoJinWoFangHouPai: number = 30;
    /**优先选择场上携带buff的目标，若没有携带buff的目标则选择防御最低的 */
    public static BuffOrFangYuDi: number = 31;
    /**指定半场 1敌方 2我方 */
    public static ZhiDingQuYu: number = 32;
    /**指定阵营攻击力最高，第4个值填阵营id */
    public static ZhenYingGongJiLiZuiGao: number = 34;
    /**暴击率最高 */
    public static BaoJiLvZuiGao: number = 35;



    /**主动技能 */
    public static Skill_Active: number = 1;
    /**自动技能 */
    public static Skill_Auto: number = 2;
    /**被动技能 */
    public static Skill_Passive: number = 3;
    /**被动触发主动技能 */
    public static Skill_PassiveToActive: number = 4;
    /**神器技能 */
    public static Skill_GodWeapon: number = 5;
    /**圣龙技能 */
    public static Skill_ShengLong: number = 6;


    public static Action_Opre_One: number = 1;
    public static Action_Opre_Quaue: number = 2;

}