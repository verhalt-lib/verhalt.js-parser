export function routePaths(input?: string): string[] {
    if (!input) {
        return [];
    }

    const paths: string[] = [];
    let currentPath: string[] = [];
    let depth = 0;

    for (let i = 0; i < input.length; i++) {
        const char = input[i];
        let skipChar = false;

        if (char === "[") {
            depth++;
        }
        else if (char === "]") {
            if (depth === 0) {
                throw new Error("Invalid bracket structure.");
            }
            depth--;
        }
        else if (char === " ") {
            if (depth !== 0) {
                continue;
            }

            if (input.slice(i, i + 4) === " ?? ") {
                i += 3;
                paths.push(currentPath.join(""));
                currentPath = [];
                skipChar = true;
            } else {
                throw new Error("Unexpected character or structure.");
            }
        }

        if (!skipChar) {
            currentPath.push(char);
        }
    }

    if (currentPath.length > 0) {
        paths.push(currentPath.join(""));
    }

    return paths;
}