export function validateStepName(input : string) : boolean {
    if(typeof input !== "string") return false;
    return validateStepNameUnsafe(input);
}

export function validateStepNameUnsafe(input : string) : boolean {
    return /^\b[a-zA-Z][a-zA-Z0-9\_]*\b$/.test(input);
}