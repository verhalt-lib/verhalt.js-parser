import { VerhaltModel } from "@verhalt/types/lib";
import { Verhalt } from "verhalt";

export function keyIndex<TModel extends VerhaltModel>(source : TModel, content? : string) : number | null {
    if(content === undefined) return null;

    if(/^(([1-9][0-9]*)|0)/.test(content)) {
        return parseInt(content);
    }
 
    const value = Verhalt.model(source, content);

    if(typeof value === "number") {
        return value;
    }
    
    return null;
}