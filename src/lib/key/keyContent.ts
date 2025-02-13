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
            default:
                handleCharacter(char);
        }
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
            body.push([false, -1]);
            depthBuffer = [];
        }
        depth++;
    }

    function handleCloseBracket() {
        if (head[1] === undefined) throw new Error("Key name was not found.");
        if (depth === 0) throw new Error("Square brackets are not balanced.");
        
        if (depth === 1) {
            const current = body[body.length - 1];
            current[1] = keyIndex(depthBuffer.join(""));
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
                depthBuffer.push(char);
            }
        } else {
            if (nameBuffer.length === 0 && !/[a-zA-Z]/.test(char)) {
                throw new Error("Invalid Character: Key name must start with a letter or be blank");
            }
            if (nameBuffer.length > 0 && !/[a-zA-Z0-9]/.test(char)) {
                throw new Error("Invalid Character: Key name must contain letters or numbers.");
            }

            nameBuffer.push(char);
        }
    }
}