import * as Lint from 'tslint';
import * as ts from 'typescript';
import { getPreviousToken } from 'tsutils';
import { completeLog } from './completeLog';
import {
  addExtraFieldsIntoNodeObjectForDebbugging,
  countNoOfNewLineChars,
  generateStringWithNewLineChars,
  getSnytaxKindKeyFromValue
} from './utils';


export class Rule extends Lint.Rules.AbstractRule {

  public static metadata: Lint.IRuleMetadata = {
    ruleName: 'line-before-tests',
    type: 'style',
    description: 'Checks there are blank lines before test cases.',
    rationale: 'Consistent line spacing between test cases',
    descriptionDetails: 'TODO write detailed description',
    options: null,
    requiresTypeInfo: false,
    optionsDescription: 'Not configurable.',
    typescriptOnly: false,
  };

  public static FAILURE_STRING_DESCRIBE = 'Should contain 2 blank lines before describe';
  public static NO_OF_BLANK_LINES_BEFORE_DESCRIBE = 2 + 1;    // 1 is by default as each describe is on new lines

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithFunction(sourceFile, walk);
  }
}

// https://github.com/palantir/tslint/blob/master/src/rules/newlineBeforeReturnRule.ts

function walk(ctx: Lint.WalkContext<void>) {

  const sourceFile = ctx.sourceFile;

  return ts.forEachChild(sourceFile, function cb(node: ts.Node): void {

      addExtraFieldsIntoNodeObjectForDebbugging(node, sourceFile);

      completeLog('\n****************');
      completeLog('node full text', node.getFullText(sourceFile));
      completeLog('node text', node.getText(sourceFile));
      completeLog('node kind', getSnytaxKindKeyFromValue(node.kind));


      if (isThingOfImportanceTOI(node, sourceFile)) {

        completeLog('complete node', node);

        if (!isTOIFirstThingInFile(node, sourceFile)) {

          const previousToken = getPreviousToken(node, sourceFile);
          completeLog('previous node full text', previousToken.getFullText(sourceFile));
          completeLog('previous node kind', getSnytaxKindKeyFromValue(previousToken.kind));

          let noOfNewLineChars = countNoOfNewLineChars(node.getFullText(sourceFile));
          if (noOfNewLineChars < Rule.NO_OF_BLANK_LINES_BEFORE_DESCRIBE) {
            ctx.addFailureAtNode(
              node,
              Rule.FAILURE_STRING_DESCRIBE,
              fixAddNewLineChars(node, Rule.NO_OF_BLANK_LINES_BEFORE_DESCRIBE - noOfNewLineChars));
          } else {
            // has atleast 2 new lines before
          }
        } else {
          // describe() is the first thing in this file. ignore
        }
      }
      return ts.forEachChild(node, cb);
    }
  );
}

const fixAddNewLineChars = (node: ts.Node, noOfNewLineCharsToAdd): Lint.Fix =>
  new Lint.Replacement(node.pos, 0, generateStringWithNewLineChars(noOfNewLineCharsToAdd));


function isThingOfImportanceTOI(node: ts.Node, sourceFile: ts.SourceFile): boolean {
  return (
    isDescribeIdentifier(node, sourceFile)
    || isXDescribeIdentifier(node, sourceFile)
  );
}

function isDescribeIdentifier(node: ts.Node, sourceFile: ts.SourceFile): boolean {
  return (
    node.kind === ts.SyntaxKind.Identifier
    && node.getText(sourceFile) === 'describe'
  );

}

function isXDescribeIdentifier(node: ts.Node, sourceFile: ts.SourceFile): boolean {
  return (
    node.kind === ts.SyntaxKind.Identifier
    && node.getText(sourceFile) === 'xdescribe'
  );
}

function isTOIFirstThingInFile(node: ts.Node, sourceFile: ts.SourceFile): boolean {
  return !getPreviousToken(node, sourceFile);
}
