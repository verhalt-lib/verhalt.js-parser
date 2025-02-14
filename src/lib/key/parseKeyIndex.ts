import { checkKeyIndex } from "./checkKeyIndex";

export function parseKeyIndex(input : string) : number | string | null {
    checkKeyIndex(input);

    if(/^(([1-9][0-9]*)|0)/.test(input)) {
        return parseInt(input);
    }
    
    return input;
}