import { VerhaltKey, VerhaltKeyHead, VerhaltKeyBody, VerhaltKeyItem } from "@verhalt/types/lib";

export function checkKeyValue(input: string) : void {
    if(typeof input !== "string") throw new Error("[VERHALT-KEY]: Key must be string");
    if(input.length === 0) throw new Error("[VERHALT-KEY]: Key must contain something.");
}

export function parseKey(input: string) : VerhaltKey | undefined {
    if(typeof input !== "string") throw new Error("[VERHALT-KEY]: Key must be string");
    if(input.length === 0) throw new Error("[VERHALT-KEY]: Key must contain something.");

    return parseKeyUnsafe(input);
}

export function parseKeyUnsafe(input: string) : VerhaltKey | undefined {
    const token = input[0];
    const isRoot = token === ":";

    if(!isRoot && token !== ".") throw new Error("[VERHALT-KEY]: Key token must be ':' or '.' character.");

    return parseKeyWithoutTokenUnsafe(input.substring(1), isRoot);
}

export function parseKeyWithoutToken(input: string) : VerhaltKey | undefined {
    if(typeof input !== "string") throw new Error("[VERHALT-KEY]: Key must be string");
    if(input.length === 0) throw new Error("[VERHALT-KEY]: Key must contain something.");

    return parseKeyWithoutTokenUnsafe(input);
}

export function parseKeyWithoutTokenUnsafe(input: string, isRoot : boolean = false) : VerhaltKey | undefined {
    if (!input) return undefined;

    let nameBuffer: string[] = [];
    let depthBuffer: string[] = [];

    let name : string | null | undefined = undefined;
    let depth = 0;
    let charIndex = 0;
    let charIndexNullable = -1;
    let globalNullableIndex = -1;

    const bodyName : VerhaltKeyItem = { value: "", nullable: false, dynamic: false };
    const bodyIndexes : VerhaltKeyItem[] = [];
    
    const head: VerhaltKeyHead = { silent: false }
    const body: VerhaltKeyBody = { name: bodyName, indexes: bodyIndexes }

    if(input.slice(input.length - 2, input.length) === "??") {
        head.silent = true;
        globalNullableIndex = input.length - 1;
    }


    for (charIndex = 0; charIndex < input.length; charIndex++) {
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

    if (depth !== 0) throw new Error("[VERHALT-KEY]: Square brackets are not balanced.");
    if (name === undefined) name = nameBuffer.join("");

    body.name.value = name;
    return { head, body };

    function handleHeadName(char: string) {
        switch(char) {
            case "?" : {
                if(nameBuffer.length === 0) {
                    throw new Error("[VERHALT-KEY]: Key cannot start with '?' character.");
                }
                charIndexNullable = charIndex;
            }
            case "[" : {
                if (nameBuffer.length === 0)  {
                    if(!isRoot) {
                        throw new Error("[VERHALT-KEY]: Non-root key must start with a name.");
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
        if (depth === 0) throw new Error("[VERHALT-KEY]:Square brackets are not balanced.");
        
        if (depth === 1) {
            if(depthBuffer.length === 0) {
                throw new Error("[VERHALT-KEY]: Key indexer must contain something.");
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
                throw new Error("[VERHALT-KEY]:Invalid '?' character");
            }
        }

        const current = body.indexes[body.indexes.length - 1];
        if (current) {
            current.nullable = true;
        } else {
            body.name.nullable = true;
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
                    throw new Error("[VERHALT-KEY]: Key must just contain '[', ']' or '?' character after name.");
                }
            }
        } else {
            if (nameBuffer.length === 0) {
                if(!/[a-zA-Z]/.test(char)) {
                    switch (char) {
                        case " ":
                            throw new Error("[VERHALT-KEY]: Key must not start with white spaces.");
                        default:
                            throw new Error("[VERHALT-KEY]: Key must start with a letter or '[' character.");
                    }
                }
            }
            else {
                if(!/[a-zA-Z0-9]/.test(char)) {
                    throw new Error("[VERHALT-KEY]: Key name must contain letters or numbers.");
                }
            }

            nameBuffer.push(char);
        }
    }
}