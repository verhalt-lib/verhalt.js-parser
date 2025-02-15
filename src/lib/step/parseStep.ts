import { VerhaltStep, VerhaltStepCatching, VerhaltStepContent, VerhaltStepDisplay, VerhaltStepForm, VerhaltStepStructure } from "@verhalt/types/lib";

export function parseStep(input : string) : VerhaltStep | undefined {
    return parseStepUnsafe(input);
}

export function parseStepUnsafe(input : string) : VerhaltStep | undefined {
    if (!input) return undefined;

    let form : VerhaltStepForm | null = null;
    let display : VerhaltStepDisplay | null = null;
    let content : VerhaltStepContent | null = null;
    let structure : VerhaltStepStructure | null = null;
    let catching : VerhaltStepCatching | null = null;

    if(form && display && content && structure && catching) {
        return { form, display, content, structure, catching };
    }

    throw new Error("[VERHALT-STEP]: An error occurred while parsing step.");
}