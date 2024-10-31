export default class Utils {
    private static _installs: Utils;
    public static get inst(): Utils {
        if (!Utils._installs) {
            Utils._installs = new Utils();
        }
        return Utils._installs;
    }

    public random(min: number, max: number): number {
        return Math.floor(min + max * Math.random());
    }
}