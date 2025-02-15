export class CharInfo implements Disposable {
    #target : string | undefined;

    #isAlphabeticLowerCase : boolean | undefined = false;
    #isAlphabeticUpperCase : boolean | undefined = false;
    #isNumeric : boolean | undefined = false;
    #isWhitespace : boolean | undefined = false;
    #isSpecial : boolean | undefined = false;

    #isCrulyOpenBracket : boolean | undefined = false;
    #isCrulyCloseBracket : boolean | undefined = false;
    #isSquareOpenBracket : boolean | undefined = false;
    #isSquareCloseBracket : boolean | undefined = false;

    #isQuestionMark : boolean | undefined = false;
    #isExclamationMark : boolean | undefined = false;

    constructor(target : string) {
        if(typeof target !== "string") throw new Error("[VERHALT-INFOCHAR]: Target must be string");
        if(target.length !== 1) throw new Error("[VERHALT-INFOCHAR]: Target must be of length 1");

        this.#target = target;
        this.#isAlphabeticLowerCase = /[a-z]/.test(target);
        this.#isAlphabeticUpperCase = !this.#isAlphabeticLowerCase && /[A-Z]/.test(target);

        this.#isNumeric = !this.isAlphabetic && /[0-9]/.test(target);

        this.#isWhitespace = !this.isAlphanumeric && /\s/.test(target);
        this.#isSpecial = !this.isAlphawhite && /[\!\@\#\$\%\^\&\*\(\)\,\.\?\"\:\{\}\|\<\>\[\]]/.test(target);

        if(this.#isSpecial) {
            switch(target) {
                case "{":
                    this.#isCrulyOpenBracket = true;
                    break;
                case "}":
                    this.#isCrulyCloseBracket = true;
                    break;
                case "[":
                    this.#isSquareOpenBracket = true;
                    break;
                case "]":
                    this.#isSquareCloseBracket = true;
                    break;
                case "?":
                    this.#isQuestionMark = true;
                    break;
                case "!":
                    this.#isExclamationMark = true;
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


    public get isCrulyOpenBracket() : boolean {
        return this.#isCrulyOpenBracket as boolean;
    }

    public get isCrulyCloseBracket() : boolean {
        return this.#isCrulyCloseBracket as boolean;
    }

    public get isCrulyBracket() : boolean {
        return this.isCrulyOpenBracket || this.isCrulyCloseBracket;
    }

    public get isSquareOpenBracket() : boolean {
        return this.#isSquareOpenBracket as boolean;
    }

    public get isSquareCloseBracket() : boolean {
        return this.#isSquareCloseBracket as boolean;
    }

    public get isSquareBracket() : boolean {
        return this.isSquareOpenBracket || this.isSquareCloseBracket;
    }

    public get isBracket() : boolean {
        return this.isCrulyBracket || this.isSquareBracket;
    }


    public get isQuestionMark() : boolean {
        return this.#isQuestionMark as boolean;
    }

    public get isExclamationMark() : boolean {
        return this.#isExclamationMark as boolean;
    }

    public get isMark() : boolean {
        return this.isQuestionMark || this.isExclamationMark;
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