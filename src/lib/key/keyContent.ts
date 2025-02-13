import { VerhaltKey, VerhaltKeyHead, VerhaltKeyBody } from "@verhalt/types";
import { keyIndex } from "./keyIndex";

export function keyContent(input?: string): VerhaltKey {
    if (!input) return [undefined, undefined];

    let nameBuffer: string[] = [];
    let depthBuffer: string[] = [];

    let head: VerhaltKeyHead = [false, undefined];
    let body: VerhaltKeyBody = [];

    let charIndex = 0;
    let charIndexNullable = -1;
    let depth = 0;

    for (charIndex = 0; charIndex < input.length; charIndex++) {
        const char = input[charIndex];

        if (head[1] === undefined) {
            handleHeadName(char);
        }

        switch (char) {
            case '[':
                handleOpenBracket();
                break;
            case ']':
                handleCloseBracket();
                break;
            case '?':
                handleNullable();
                break;
        }

        handleCharacter(char);
    }

    if (depth !== 0) throw new Error("Square brackets are not balanced.");

    return [head, body];

    function handleHeadName(char: string) {
        switch(char) {
            case "?" : {
                if(nameBuffer.length === 0) {
                    throw new Error("Invalid Character: Key cannot start with '?' character.");
                }
                charIndexNullable = charIndex;
            }
            case "[" : {
                if (nameBuffer.length === 0)  {
                    head[1] = null;
                }
                else {
                    head[1] = nameBuffer.join("");
                }
                break;
            }
        }
    }

    function handleOpenBracket() {
        if (depth === 0) {
            body.push([false, ""]);
            depthBuffer = [];
        }
        depth++;
    }

    function handleCloseBracket() {
        if (depth === 0) throw new Error("Square brackets are not balanced.");
        
        if (depth === 1) {
            if(depthBuffer.length === 0) {
                throw new Error("Invalid Content: Key indexer must contain something.");
            }

            const current = body[body.length - 1];
            current[1] = depthBuffer.join("");
            charIndexNullable = charIndex + 1;
        }
        depth--;
    }

    function handleNullable() {
        if (depth !== 0) return;
        if (charIndexNullable !== charIndex) throw new Error("Invalid '?' character");

        const current = body[body.length - 1];
        if (current) {
            current[0] = true;
        } else {
            head[0] = true;
        }

        charIndexNullable = -1;
    }

    function handleCharacter(char: string) {
        if (head[1] !== undefined) {
            if (depth > 0) {
                switch (char) {
                    case "[": {
                        if(depth === 1) {
                            break;
                        }
                    }
                    default: {
                        depthBuffer.push(char);
                    }
                }
            }
            else {
                if(!/[\[\]\?]/.test(char)) {
                    throw new Error("Invalid Character: Key must just contain '[', ']' or '?' character after name.");
                }
            }
        } else {
            if (nameBuffer.length === 0) {
                if(!/[a-zA-Z]/.test(char)) {
                    switch (char) {
                        case " ":
                            throw new Error("Invalid Character: Key must not start with white spaces.");
                        default:
                            throw new Error("Invalid Character: Key must start with a letter or '[' character.");
                    }
                }
            }
            else {
                if(!/[a-zA-Z0-9]/.test(char)) {
                    throw new Error("Invalid Character: Key name must contain letters or numbers.");
                }
            }

            nameBuffer.push(char);
        }
    }
}