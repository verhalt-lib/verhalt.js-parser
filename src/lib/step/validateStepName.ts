export function validateStepName(input : string) : boolean {
    if(typeof input !== "string") return false;
    return validateStepNameUnsafe(input);
}

export function validateStepNameUnsafe(input : string) : boolean {
    return /[a-zA-Z][a-zA-Z0-9]*/.test(input);
}