import { validateStepIndexUnsafe } from "./validateStepIndex";

export function checkStepIndex(input : string) {
    if(typeof input !== "string") throw new Error("[VERHALT-STEP]: Step index must be string");
    checkStepIndexUnsafe(input);
}

export function checkStepIndexUnsafe(input : string) : void {
    if(!validateStepIndexUnsafe(input)) throw new Error("[VERHALT-STEP]: Step index is invalid");
}