export function checkStep(input : string) {
    if(!["string", "null", "undefined"].includes(typeof input)) throw new Error("[VERHALT-STEP]: Step can be string, null or undefined");
}