import Shared2 from "./Shared2";
import * as TestResource from "Resources/TestResource.json";

export default class Shared {
    constructor(x: string) {
        console.log(`x: ${x} TestKey: ${TestResource.TestKey}`);
        new Shared2("Shared");
    }
}