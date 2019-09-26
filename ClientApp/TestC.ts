import { TestCBase } from "./TestCBase";

export class TestC extends TestCBase {
    constructor(x: string) {
        super(`TestC : ${x}`);
    }
}
