export function checkKey(input: string) : void {
    if(typeof input !== "string") throw new Error("[VERHALT-KEY]: Key must be string");
    if(input.length === 0) throw new Error("[VERHALT-KEY]: Key must contain something.");
}