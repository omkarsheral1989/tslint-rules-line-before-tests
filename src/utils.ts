import * as ts from 'typescript';

export function getSnytaxKindKeyFromValue(value: number) {
  // for (const key in SyntaxKind) {
  //   if (SyntaxKind[key] === value) {
  //     return key;
  //   }
  // }
  return `${ts.SyntaxKind['' + value]}(${value})`;
}

export function countNoOfNewLineChars(str: string): number {
  let count = 0;
  for (let i = 0; i < str.length; i++) {
    if (str.charAt(i) === '\n') {
      count++;
    }
  }
  return count;
}

export function generateStringWithNewLineChars(noOfNewLineCharsNeededInString: number, existingString: string = ''): string {
  if (noOfNewLineCharsNeededInString <= 0) {
    return existingString!;
  }
  return generateStringWithNewLineChars(
    noOfNewLineCharsNeededInString - 1,
    existingString + '\n'
  );
}

export function addExtraFieldsIntoNodeObjectForDebbugging(node: ts.Node, sourceFile: ts.SourceFile) {
  (node as any).kindStr = getSnytaxKindKeyFromValue(node.kind);
  (node as any).fullText=node.getFullText(sourceFile)
}
