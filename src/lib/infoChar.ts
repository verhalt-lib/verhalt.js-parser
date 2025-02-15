export abstract class InfoChar implements Disposable {
    #char : string | undefined;
    #isLetterLowerCase : boolean | undefined;
    #isLetterUpperCase : boolean | undefined;

    constructor(char : string) {
        if(typeof char !== "string") throw new Error("[VERHALT-INFOCHAR]: Char must be string");
        if(char.length !== 1) throw new Error("[VERHALT-INFOCHAR]: Char must be of length 1");

        this.#char = char;
        this.#isLetterLowerCase = /[a-z]/.test(char);
        this.#isLetterUpperCase = /[A-Z]/.test(char);
    }

    public get char() : string {
        return this.#char as string;
    }

    public get isLowerCaseLetter() : boolean {
        return this.#isLetterLowerCase as boolean;
    }

    public get isUpperCaseLetter() : boolean {
        return this.#isLetterUpperCase as boolean;
    }

    public get isLetter() : boolean {
        return this.isLowerCaseLetter || this.isUpperCaseLetter;
    }

    protected abstract onDispose(): void;

    [Symbol.dispose](): void {
        this.#char = undefined;
    }
}