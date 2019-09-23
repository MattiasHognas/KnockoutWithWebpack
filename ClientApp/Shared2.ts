import Shared3 from "./Shared3";

export default class Shared2 {
    constructor(x: string) {
        console.log(`x: ${x}`);
        new Shared3("Shared2");
    }
}