import { test } from 'vitest';

test('keyContent', async (context) => {
    const {keyContent} = await import('../src/lib/key/keyContent');

    keyContent("[345]");
});