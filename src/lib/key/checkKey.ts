export function checkKey(input: string) : void {
    checkKeyWithoutToken(input);
    if(![":", "."].includes(input[0])) throw new Error("[VERHALT-KEY]: Key token must be ':' or '.' character.");
}

export function checkKeyWithoutToken(input: string) : void {
    if(typeof input !== "string") throw new Error("[VERHALT-KEY]: Key must be string");
    if(input.length === 0) throw new Error("[VERHALT-KEY]: Key must contain something.");
}