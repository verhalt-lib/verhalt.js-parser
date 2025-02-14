import { VerhaltKey, VerhaltKeyHead, VerhaltKeyBody } from "@verhalt/types/lib";

export function keyContent(input?: string) : VerhaltKey | undefined {
    if (!input) return undefined;
    if(![":", "."].includes(input[0])) throw new Error("Invalid Character: Key must start with ':' or '.' character.");
    
    let isRoot = input[0] === ":";
    let nameBuffer: string[] = [];
    let depthBuffer: string[] = [];

    let name : string | null | undefined = undefined;
    let depth = 0;
    let charIndex = 0;
    let charIndexNullable = -1;
    let globalNullable = false;
    let globalNullableIndex = -1;

    if(input.slice(input.length - 2, input.length) === "??") {
        globalNullable = true;
        globalNullableIndex = input.length - 1;
    }

    let head: VerhaltKeyHead = {
        silent: globalNullable
    }
    let body: VerhaltKeyBody = {
        name: { value: "", nullable: false, dynamic: false },
        indexes: [],
    }

    for (charIndex = 1; charIndex < input.length; charIndex++) {
        const char = input[charIndex];

        if (name === undefined) {
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
    if (name === undefined) name = nameBuffer.join("");

    return { head, body };

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
                    if(!isRoot) {
                        throw new Error("Invalid Character: Non-root key must start with a name.");
                    }

                    name = null;
                }
                else {
                    name = nameBuffer.join("");
                }
                break;
            }
        }
    }

    function handleOpenBracket() {
        if (depth === 0) {
            body.indexes.push({ value: "", nullable: false, dynamic: false });
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

            const current = body.indexes[body.indexes.length - 1];
            current.value = depthBuffer.join("");

            charIndexNullable = charIndex + 1;
        }
        depth--;
    }

    function handleNullable() {
        if (depth !== 0) return;
        if (charIndexNullable !== charIndex) {

            if(charIndex !== globalNullableIndex) {
                throw new Error("Invalid '?' character");
            }
        }

        if(!globalNullable) {
            const current = body.indexes[body.indexes.length - 1];
            if (current) {
                current.nullable = true;
            } else {
                body.name.nullable = true;
            }
        }

        charIndexNullable = -1;
    }

    function handleCharacter(char: string) {
        if (name !== undefined) {
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