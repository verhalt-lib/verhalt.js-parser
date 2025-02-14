export function checkKeyIndex(input: string) : void {
    if (typeof input !== "string") throw new Error("[VERHALT-KEYINDEX]: Key index must be string");
}