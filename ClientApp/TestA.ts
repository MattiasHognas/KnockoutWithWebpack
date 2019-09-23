import { TestABase } from "./TestABase";
import $ from "jquery";
import * as ko from "knockout";

export default class TestA extends TestABase {
    public TestProp = ko.observable<string>("TestA Observable");
    constructor() {
        super("TestA");
        console.log(`TestA.RootDiv : ${$("#root")}`);
    }
}