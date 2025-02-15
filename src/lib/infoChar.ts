export class InfoChar implements Disposable {
    #char : string | undefined;
    #isAlphabeticLowerCase : boolean | undefined;
    #isAlphabeticUpperCase : boolean | undefined;
    #isNumeric : boolean | undefined;
    #isWhitespace : boolean | undefined;
    #isSpecial : boolean | undefined;
    #isUnknown : boolean | undefined;

    constructor(char : string) {
        if(typeof char !== "string") throw new Error("[VERHALT-INFOCHAR]: Char must be string");
        if(char.length !== 1) throw new Error("[VERHALT-INFOCHAR]: Char must be of length 1");

        this.#char = char;
        this.#isAlphabeticLowerCase = /[a-z]/.test(char);
        this.#isAlphabeticUpperCase = /[A-Z]/.test(char);

        if(!this.isAlphabetic) {
            this.#isNumeric = /[0-9]/.test(char);
        }
        else {
            this.#isNumeric = false;
        }

        if(!this.isAlphanumeric) {
            this.#isWhitespace = /\s/.test(char);
        }
        else {
            this.#isWhitespace = false;
        }

        if(!this.isAlphawhite) {
            this.#isSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(char);
            this.#isUnknown = !this.#isSpecial;
        }
        else {
            this.#isSpecial = false;
            this.#isUnknown = false;
        }
    }

    public get char() : string {
        return this.#char as string;
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

    public get isUnknown() : boolean {
        return this.#isUnknown as boolean;
    }


    [Symbol.dispose]() : void {
        this.#char = undefined;
        this.#isAlphabeticLowerCase = undefined;
        this.#isAlphabeticUpperCase = undefined;
        this.#isNumeric = undefined;
        this.#isWhitespace = undefined;
        this.#isSpecial = undefined;
        this.#isUnknown = undefined;
    }
}