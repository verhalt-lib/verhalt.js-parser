export function checkStep(input : string) {
    if(!["string", "undefined"].includes(typeof input)) throw new Error("[VERHALT-STEP]: Step must be string or undefined" + typeof input);
}