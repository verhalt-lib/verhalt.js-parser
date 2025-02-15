import { test } from 'vitest';

test('keyContent', async (context) => {
    const {parseRoutePaths: routePaths} = await import('../src/lib/route/parseRoutePaths');
    const {parsePathKeys: pathKeys} = await import('../src/lib/path/parsePathKeys');
    const {parseKey: keyValue} = await import('../src/lib/key/parseKey');
    const {parseStep } = await import('../src/lib/step/parseStep');

    console.log(parseStep("aha"));
    console.log(parseStep("aha?"));
    console.log(parseStep("aha!"));
    console.log(parseStep("{:cigu[:cigu[0]]}!"));
    console.log(parseStep("{:{:cigu[12]}.sasa}?"));
    console.log(parseStep("{124}!"));
    console.log(parseStep("[12]?"));
    console.log(parseStep("[haha]!"));
});