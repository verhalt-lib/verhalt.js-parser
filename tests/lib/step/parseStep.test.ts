import { it, expect } from 'vitest';
import { parseStep } from '../../../src/lib/step/parseStep';

it("should return undefined for empty inputs", () => {
    expect(parseStep("")).toBeUndefined();
    expect(parseStep(undefined as unknown as string)).toBeUndefined()
});

it("should throw error for unexpected inputs", () => {
    expect(() => parseStep(null as unknown as string)).toThrowError();
    expect(() => parseStep(2004 as unknown as string)).toThrowError();
    expect(() => parseStep(true as unknown as string)).toThrowError();
    expect(() => parseStep({ myObject : 1} as unknown as string)).toThrowError();
});

it("should return correct values for static name steps", () => {
    expect(parseStep("My_StEp")).toEqual({ form: "name", display: "My_StEp", content: "My_StEp", structure: "static", catching: "native" });
    expect(parseStep("My_StEp?")).toEqual({ form: "name", display: "My_StEp?", content: "My_StEp", structure: "static", catching: "optional" });
    expect(parseStep("My_StEp!")).toEqual({ form: "name", display: "My_StEp!", content: "My_StEp", structure: "static", catching: "strict" });
})