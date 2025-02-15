export class CharInfo implements Disposable {
    #target : string | undefined;

    #isAlphabeticLowerCase : boolean | undefined = false;
    #isAlphabeticUpperCase : boolean | undefined = false;
    #isNumeric : boolean | undefined = false;
    #isWhitespace : boolean | undefined = false;
    #isSpecial : boolean | undefined = false;

    #isCrulyOpen : boolean | undefined = false;
    #isCrulyClose : boolean | undefined = false;
    #isSquareOpen : boolean | undefined = false;
    #isSquareClose : boolean | undefined = false;

    constructor(target : string) {
        if(typeof target !== "string") throw new Error("[VERHALT-INFOCHAR]: Target must be string");
        if(target.length !== 1) throw new Error("[VERHALT-INFOCHAR]: Target must be of length 1");

        this.#target = target;
        this.#isAlphabeticLowerCase = /[a-z]/.test(target);
        this.#isAlphabeticUpperCase = !this.#isAlphabeticLowerCase && /[A-Z]/.test(target);

        this.#isNumeric = !this.isAlphabetic && /[0-9]/.test(target);

        this.#isWhitespace = !this.isAlphanumeric && /\s/.test(target);
        this.#isSpecial = !this.isAlphawhite && /[!@#$%^&*(),.?":{}|<>]/.test(target);

        if(this.#isSpecial) {
            switch(target) {
                case "{":
                    this.#isCrulyOpen = true;
                    break;
                case "}":
                    this.#isCrulyClose = true;
                    break;
                case "[":
                    this.#isSquareOpen = true;
                    break;
                case "]":
                    this.#isSquareClose = true;
                    break;
            }
        }
    }

    public get target() : string {
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


    public get isCrulyOpen() : boolean {
        return this.#isCrulyOpen as boolean;
    }

    public get isCrulyClose() : boolean {
        return this.#isCrulyClose as boolean;
    }

    public get isSquareOpen() : boolean {
        return this.#isSquareOpen as boolean;
    }

    public get isSquareClose() : boolean {
        return this.#isSquareClose as boolean;
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