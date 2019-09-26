import Shared3 from "./Shared3";
import ko, { Observable } from "knockout";
import { TestC } from "./TestC";

export default class TestB {
    public TestBInstanceProp: Observable<TestC> = ko.observable<TestC>();
    constructor() {
        this.TestBInstanceProp(new TestC("TestBaaa"));
        new Shared3("TestB");
        console.log(`TestB.RootDiv : ${document.getElementById("test-root")}`);
    }
}