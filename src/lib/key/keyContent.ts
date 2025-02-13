import { VerhaltKey, VerhaltKeyHead, VerhaltKeyBody } from "@verhalt/types";

export function pathKeyContentParser(input?: string): VerhaltKey {
    if (!input) return [undefined, undefined];

    let nameBuffer: string[] = [];
    let depthBuffer: string[] = [];

    let head: VerhaltKeyHead = [false, undefined];
    let body: VerhaltKeyBody = [];

    let isNullable = false;
    let isNullSignable = false;
    let depth = 0;

    for (let i = 0; i < input.length; i++) {
        const char = input[i];
        const current = body[body.length - 1];

        if (!head[1]) {
            if (char === '?') {
                isNullSignable = true;
            } else if (char === '[') {
                if (nameBuffer.length === 0) throw new Error("Key name was not found.");
                head[1] = nameBuffer.join("");
            }
        } else if (depth === 0 && char !== '?') {
            isNullSignable = false;
        }

        switch (char) {
            case '[':
                if (depth === 0) {
                    body.push([false, -1]); // Yeni index slotu
                    depthBuffer = [];
                }
                depth++;
                break;
            case ']':
                if (!head[1]) throw new Error("Key name was not found.");
                if (depth === 0) throw new Error("Square brackets are not balanced.");
                
                if (depth === 1) {
                    current[1] = -1/*pathKeyIndexParser(depthBuffer.join(""))*/;
                    isNullSignable = true;
                }
                depth--;
                break;
            case '?':
                if (depth !== 0) break;
                if (!isNullSignable) throw new Error("Invalid '?' Character");

                if (current) {
                    current[0] = true;
                } else {
                    isNullable = true;
                }
                break;
            default:
                if (head[1]) {
                    if (depth > 0) depthBuffer.push(char);
                } else {
                    if (nameBuffer.length === 0 && !/[a-zA-Z]/.test(char)) {
                        throw new Error("Invalid Character: Key name must start with a letter.");
                    }
                    if (nameBuffer.length > 0 && !/[a-zA-Z0-9]/.test(char)) {
                        throw new Error("Invalid Character: Key name must contain letters or numbers.");
                    }
                    nameBuffer.push(char);
                }
        }
    }

    if (depth !== 0) throw new Error("Square brackets are not balanced.");
    if (!head[1]) head[1] = nameBuffer.join("");

    return [head, body];
}