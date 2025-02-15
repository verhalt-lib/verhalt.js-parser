export function validateStepIndex(input : string) : boolean {
    if(typeof input !== "string") return false;
    return validateStepIndexUnsafe(input);
}

export function validateStepIndexUnsafe(input : string) : boolean {
    return /^\b((?:[0]*([1-9][0-9]*))|0*)\b$/.test(input);
}