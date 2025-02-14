export function parseKeyIndex(input? : string) : number | string | null {
    if(input === undefined) return null;

    if(/^(([1-9][0-9]*)|0)/.test(input)) {
        return parseInt(input);
    }
    
    return input;
}