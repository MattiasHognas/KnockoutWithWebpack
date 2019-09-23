import Shared2 from "./Shared2";

export default class Shared {
    constructor(x: string) {
        console.log(`x: ${x}`);
        new Shared2("Shared");
    }
}