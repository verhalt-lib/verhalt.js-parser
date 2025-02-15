export function isStepName(input : string) : boolean {
    if(typeof input !== "string") return false;
    return isStepNameUnsafe(input);
}

export function isStepNameUnsafe(input : string) : boolean {
    return /[a-zA-Z][a-zA-Z0-9]*/.test(input);
}