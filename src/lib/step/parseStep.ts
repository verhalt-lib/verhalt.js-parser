import { VerhaltStep, VerhaltStepCatching, VerhaltStepContent, VerhaltStepDisplay, VerhaltStepForm, VerhaltStepStructure } from "@verhalt/types/lib";

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
    let bracketForm : "curly" | "square" | undefined = undefined;
    let bracketDepth = 0;

    const contentBuffer : string[] = [];

    for(let ci = 0; ci < input.length; ci++) {
        const char = input[ci];

        if(ci === 0) {
            if(/[\{\[]/.test(char)) {
                bracketForm = char === "{" ? "curly" : "square";

                form = bracketForm === "curly" ? "name" : "index";
                structure = "variable";
            }
            else if(/[a-zA-Z]/.test(char)) {
                bracketForm = undefined;

                form = "name";
                structure = "static";
            }
        }

        if(bracketDepth !== 0) {
            contentBuffer.push(char);
        }

        if(char === "{" || char === "[") {
            if(bracketDepth === 0) {
                if(!bracketForm) {
                    throw new Error("[VERHALT-STEP]: Bracket is not defined.");
                }
            }
            bracketDepth++;
        }
        else if(char === "}" || char === "]") {
            if(bracketDepth === 0) {
                if(!bracketForm) {
                    throw new Error("[VERHALT-STEP]: Bracket is not defined.");
                }
            }
            else if(bracketDepth === 1) {
                if(!["?", "!", undefined].includes(input[ci + 1])) {
                    throw new Error("[VERHALT-STEP]: Unexpected character after closing bracket.");
                }

                contentBuffer.pop();
                finalize = true;
            }

            bracketDepth--;
        }
        else {
            if(bracketDepth === 0) {
                if(!/[a-zA-Z0-9]/.test(char)) {

                    if(ci === input.length - 1) {

                        if(/[\?\!]/.test(char)) {
                            switch  (char) {
                                case "?":
                                    catching = "optional";
                                    break;
                                case "!":
                                    catching = "strict";
                                    break;
                            }
                        }

                        throw new Error("[VERHALT-STEP]: Unexpected character after '?' or '!'.");
                    }
                    throw new Error("[VERHALT-STEP]: Unexpected character.");
                }
            }
        }

        if(finalize) {
            break;
        }
    }

    display = input;
    content = contentBuffer.join("");

    if(form && display && content && structure && catching) {
        return { form, display, content, structure, catching };
    }

    throw new Error("[VERHALT-STEP]: An error occurred while parsing step.");
}