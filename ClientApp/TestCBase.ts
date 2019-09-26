import ko, { Observable } from "knockout";

export abstract class TestCBase {
    public TestTextProp: Observable<string> = ko.observable<string>()
    constructor(x: string) {
        this.TestTextProp(`TestCBase.TestTextProp : ${x}`);
    }
}
