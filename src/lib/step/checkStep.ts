export function checkStep(input : string) {
    if(typeof input !== "string") throw new Error("[VERHALT-STEP]: Step must be string");
}