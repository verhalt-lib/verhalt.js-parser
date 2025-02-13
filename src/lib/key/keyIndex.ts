export function keyIndex(input? : string) : number {
    if(input === undefined) return -1;

    if(/^(([1-9][0-9]*)|0)/.test(input)) {
        return parseInt(input);
    }

    return -1;
}