import { VerhaltKey, VerhaltKeyHead, VerhaltKeyBody } from "@verhalt/types";
import { keyIndex } from "./keyIndex";

export function keyContent(input?: string): VerhaltKey {
    if (!input) return [undefined, undefined];

    let nameBuffer: string[] = [];
    let depthBuffer: string[] = [];

    let head: VerhaltKeyHead = [false, undefined];
    let body: VerhaltKeyBody = [];

    let isNullSignable = false;
    let depth = 0;

    for (let i = 0; i < input.length; i++) {
        const char = input[i];

        if (head[1] === undefined) {
            handleHeadName(char);
        } else {
            if (depth === 0 && char !== '?') {
                isNullSignable = false;
            }
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
        if (char === '?') {
            isNullSignable = true;
        } else if (char === '[') {
            if (nameBuffer.length === 0)  {
                head[1] = null;
            }
            else {
                head[1] = nameBuffer.join("");
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

        if(depthBuffer.length === 0) {
            throw new Error("Invalid Content: Key indexer must contain something.");
        }
        
        if (depth === 1) {
            const current = body[body.length - 1];
            current[1] = depthBuffer.join("");
            isNullSignable = true;
        }
        depth--;
    }

    function handleNullable() {
        if (depth !== 0) return;
        if (!isNullSignable) throw new Error("Invalid '?' character");

        const current = body[body.length - 1];
        if (current) {
            current[0] = true;
        } else {
            head[0] = true;
        }
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