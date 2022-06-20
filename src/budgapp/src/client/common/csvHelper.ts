export function processCSVItems<T>(
    csvData: string,
    processor: (row: string[], header: string[]) => T
): T[] {
    const retVal: T[] = [];
    const lines = csvData.split('\n');
    const header = lines[0].split(',');
    for (let i = 1; i < lines.length; i++) {
        retVal.push(processor(lines[i].split(','), header));
    }

    return retVal;
}