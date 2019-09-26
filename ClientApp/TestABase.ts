import ko, { Observable } from "knockout";
import { TestC } from "./TestC";

export abstract class TestABase {
    public TestAInstanceProp: Observable<TestC> = ko.observable<TestC>();
    constructor(x: string) {
        this.TestAInstanceProp(new TestC(x));
    }
}
