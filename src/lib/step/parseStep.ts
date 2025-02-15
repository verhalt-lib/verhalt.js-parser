import { VerhaltStep, VerhaltStepCatching, VerhaltStepContent, VerhaltStepDisplay, VerhaltStepForm, VerhaltStepStructure } from "@verhalt/types/lib";
import { validateStepName } from "./validateStepName";

export function parseStep(input : string) : VerhaltStep | undefined {
    return parseStepUnsafe(input);
}

export function parseStepUnsafe(input : string) : VerhaltStep | undefined {
    if (!input) return undefined;

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
        const char = input[ci];

        if(ci === 0) {
            if(/[\{\[]/.test(char)) {
                bracketForm = char === "{" ? "{}" : "[]";

                form = bracketForm === "{}" ? "name" : "index";
            }
            else if(/[a-zA-Z]/.test(char)) {
                bracketForm = undefined;

                form = "name";
            }
        }

        if(bracketDepth !== 0) {
            contentBuffer.push(char);
        }

        if(char === "{" || char === "[") {
            if(!bracketForm) {
                throw new Error("[VERHALT-STEP]: Bracket is not defined.");
            }

            if(bracketForm.includes(char))
                bracketDepth++;
        }
        else if(char === "}" || char === "]") {
            if(!bracketForm) {
                throw new Error("[VERHALT-STEP]: Bracket is not defined.");
            }

            if(bracketDepth === 1) {
                if(!["?", "!", undefined].includes(input[ci + 1])) {
                    throw new Error("[VERHALT-STEP]: Unexpected character after closing bracket.");
                }

                contentBuffer.pop();
            }

            if(bracketForm.includes(char))
                bracketDepth--;
        }
        else {
            if(bracketDepth === 0) {
                if(!/[a-zA-Z0-9]/.test(char)) {

                    if(ci === input.length - 1) {

                        if(!/[\?\!]/.test(char)) {
                            throw new Error("[VERHALT-STEP]: Unexpected character after '?' or '!'.");
                        }

                        switch  (char) {
                            case "?":
                                catching = "optional";
                                break;
                            case "!":
                                catching = "strict";
                                break;
                        }
                    }
                    else {
                        throw new Error("[VERHALT-STEP]: Unexpected character.");
                    }
                }
            }
        }
    }

    display = input;
    content = bracketForm ? contentBuffer.join("") : display;

    if(form === "name") {
        structure = validateStepName(content) ? "static" : "variable";
    }

    if(form && display && content && structure && catching) {
        return { form, display, content, structure, catching };
    }

    throw new Error("[VERHALT-STEP]: An error occurred while parsing step.");
}