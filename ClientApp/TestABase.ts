import Shared from "./Shared";

export abstract class TestABase {
    public X: string;
    constructor(x: string) {
        this.X = `TestABase.X : ${x}`;
        new Shared(this.X);
    }
}
