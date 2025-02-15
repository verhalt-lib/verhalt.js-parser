export class InfoChar implements Disposable {
    #target : string | undefined;
    #isAlphabeticLowerCase : boolean | undefined;
    #isAlphabeticUpperCase : boolean | undefined;
    #isNumeric : boolean | undefined;
    #isWhitespace : boolean | undefined;
    #isSpecial : boolean | undefined;

    constructor(target : string) {
        if(typeof target !== "string") throw new Error("[VERHALT-INFOCHAR]: Target must be string");
        if(target.length !== 1) throw new Error("[VERHALT-INFOCHAR]: Target must be of length 1");

        this.#target = target;
        this.#isAlphabeticLowerCase = /[a-z]/.test(target);
        this.#isAlphabeticUpperCase = !this.#isAlphabeticLowerCase && /[A-Z]/.test(target);

        this.#isNumeric = !this.isAlphabetic && /[0-9]/.test(target);

        this.#isWhitespace = !this.isAlphanumeric && /\s/.test(target);
        this.#isSpecial = !this.isAlphawhite && /[!@#$%^&*(),.?":{}|<>]/.test(target);
    }

    public get char() : string {
        return this.#target as string;
    }

    public get isLowerCaseLetter() : boolean {
        return this.#isAlphabeticLowerCase as boolean;
    }

    public get isUpperCaseLetter() : boolean {
        return this.#isAlphabeticUpperCase as boolean;
    }

    public get isAlphabetic() : boolean {
        return this.isLowerCaseLetter || this.isUpperCaseLetter;
    }

    public get isNumeric() : boolean {
        return this.#isNumeric as boolean;
    }

    public get isAlphanumeric() : boolean {
        return this.isAlphabetic || this.isNumeric;
    }

    public get isWhitespace() : boolean {
        return this.#isWhitespace as boolean;
    }

    public get isAlphawhite() : boolean {
        return this.isAlphanumeric || this.isWhitespace;
    }

    public get isSpecial() : boolean {
        return this.#isSpecial as boolean;
    }


    [Symbol.dispose]() : void {
        this.#target = undefined;
        this.#isAlphabeticLowerCase = undefined;
        this.#isAlphabeticUpperCase = undefined;
        this.#isNumeric = undefined;
        this.#isWhitespace = undefined;
        this.#isSpecial = undefined;
    }
}