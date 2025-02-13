import { test } from 'vitest';

test('keyContent', async (context) => {
    const {routePaths} = await import('../src/lib/route/routePaths');
    const {pathKeys} = await import('../src/lib/path/pathKeys');
    const {keyContent} = await import('../src/lib/key/keyContent');

    console.log(routePaths("fsdfds[fd][asd]?[3454][:: fdfdls]?? ?? sdfsdf"));
});