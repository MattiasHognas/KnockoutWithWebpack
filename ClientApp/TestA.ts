import { TestABase } from "./TestABase";
import $ from "jquery";
import Shared from "./Shared";

export default class TestA extends TestABase {
    constructor() {
        super("Value from TestA");
        new Shared(this.TestAInstanceProp().TestTextProp());
        console.log(`TestA.RootDiv : ${$("#test-root").get(0)}`);
    }
}