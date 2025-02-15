import { VerhaltStep, VerhaltStepCatching, VerhaltStepContent, VerhaltStepDisplay, VerhaltStepForm, VerhaltStepStructure } from "@verhalt/types/lib";
import { validateStepName } from "./validateStepName";
import { validateStepIndex } from "./validateStepIndex";
import { CharInfo } from "../charInfo";

export function parseStep(input : string) : VerhaltStep | undefined {
    return parseStepUnsafe(input);
}

export function parseStepUnsafe(input : string) : VerhaltStep | undefined {
    if (!input) return undefined;
    if (input.length === 0) return undefined;

    let form : VerhaltStepForm | null = null;
    let display : VerhaltStepDisplay | null = null;
    let content : VerhaltStepContent | null = null;
    let structure : VerhaltStepStructure | null = null;
    let catching : VerhaltStepCatching = "native";

    let finalize : boolean = false;
    let bracketForm : "{}" | "[]" | undefined = undefined;
    let bracketDepth = 0;

    const contentBuffer : string[] = [];

    for(let ci = 0; ci < input.length; ci++) {
        const char = new CharInfo(input[ci]);

        if(ci === 0) {
            if(char.isCrulyOpenBracket || char.isSquareOpenBracket) {
                if(char.isCrulyOpenBracket) {
                    form = "name";
                    bracketForm = "{}";
                }
                else {
                    form = "index";
                    bracketForm = "[]";
                }
            }
            else if(char.isAlphabetic) {
                form = "name";
                bracketForm = undefined;
            }
            else {
                throw new Error("[VERHALT-STEP]: It must start with alphabetic character.");
            }
        }

        if(bracketDepth !== 0) {
            if (char.isAlphanumeric) {
                contentBuffer.push(char.target);
            }
        }

        if(char.isCrulyOpenBracket || char.isSquareOpenBracket) {
            if(!bracketForm) {
                throw new Error("[VERHALT-STEP]: Bracket is not defined.");
            }

            if(bracketForm.includes(char.target))
                bracketDepth++;
        }
        else if(char.isCrulyCloseBracket || char.isSquareCloseBracket) {
            if(!bracketForm) {
                throw new Error("[VERHALT-STEP]: Bracket is not defined.");
            }

            if(bracketDepth === 1) {
                if(!["?", "!", undefined].includes(input[ci + 1])) {
                    throw new Error("[VERHALT-STEP]: Unexpected character after closing bracket.");
                }

                contentBuffer.pop();
            }

            if(bracketForm.includes(char.target))
                bracketDepth--;
        }
        else {
            if(bracketDepth === 0) {
                if(!char.isAlphanumeric) {

                    if(ci === input.length - 1) {

                        if(!(char.isQuestionMark || char.isExclamationMark)) {
                            throw new Error("[VERHALT-STEP]: Unexpected character after '?' or '!'.");
                        }

                        switch  (char.target) {
                            case "?":
                                catching = "optional";
                                break;
                            case "!":
                                catching = "strict";
                                break;
                        }

                        contentBuffer.pop();
                    }
                    else {
                        throw new Error("[VERHALT-STEP]: Unexpected character.");
                    }
                }
            }
        }

        char[Symbol.dispose]();
    }

    display = input;
    content = bracketForm ? contentBuffer.join("") : display;

    if(form === "name") {
        structure = validateStepName(content) ? "static" : "variable";
    }
    else {
        structure = validateStepIndex(content) ? "static" : "variable";
    }

    if(form && display && content && structure && catching) {
        return { form, display, content, structure, catching };
    }

    throw new Error("[VERHALT-STEP]: An error occurred while parsing step.");
}