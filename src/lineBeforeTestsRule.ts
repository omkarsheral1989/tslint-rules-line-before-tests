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
import { defaultOptions, incrementOptionsNumbersBy1, IOptions } from './options';


export class Rule extends Lint.Rules.AbstractRule {

  public static metadata: Lint.IRuleMetadata = {
    ruleName: 'line-before-tests',
    type: 'style',
    description: 'Checks there are blank lines before test cases.',
    descriptionDetails: 'TODO write detailed description',
    rationale: 'Consistent line spacing between test cases',
    hasFix: true,
    optionsDescription: 'TODO ',
    options: 'TODO',
    optionExamples: ['TODO'],
    requiresTypeInfo: false,
    typescriptOnly: false,
  };

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithFunction(sourceFile, walk, this.ruleArguments);
  }
}

// https://github.com/palantir/tslint/blob/master/src/rules/newlineBeforeReturnRule.ts

function walk(ctx: Lint.WalkContext<IOptions[]>) {
  ctx.options[0] = ctx.options[0] || defaultOptions;
  const options: IOptions = {
    ...defaultOptions,
    ...ctx.options[0],
  };
  incrementOptionsNumbersBy1(options);

  const sourceFile = ctx.sourceFile;

  completeLog('rule args', options);

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
          const noOfNewLineCharsNeeded = getNoOfNewLineCharsNeededForTOI(node, sourceFile, options);

          if (noOfNewLineChars < noOfNewLineCharsNeeded) {
            ctx.addFailureAtNode(
              node,
              getFailureString(node, sourceFile, options),
              fixAddNewLineChars(node, noOfNewLineCharsNeeded - noOfNewLineChars)
            );
          } else {
            // has at least 2 new lines before
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
    || isTestIdentifier(node, sourceFile)
  );
}

function isDescribeIdentifier(node: ts.Node, sourceFile: ts.SourceFile): boolean {
  return (
    node.kind === ts.SyntaxKind.Identifier
    && (
      node.getText(sourceFile) === 'describe'
      || node.getText(sourceFile) === 'xdescribe'
    )
  );
}

function isTestIdentifier(node: ts.Node, sourceFile: ts.SourceFile): boolean {
  return (
    node.kind === ts.SyntaxKind.Identifier
    && (
      node.getText(sourceFile) === 'it'
      || node.getText(sourceFile) === 'xit'
      || node.getText(sourceFile) === 'test'
      || node.getText(sourceFile) === 'xtest'
    )
  );
}

function isTOIFirstThingInFile(node: ts.Node, sourceFile: ts.SourceFile): boolean {
  return !getPreviousToken(node, sourceFile);
}

function getNoOfNewLineCharsNeededForTOI(node: ts.Node, sourceFile: ts.SourceFile, options: IOptions): number {
  if (isDescribeIdentifier(node, sourceFile)) {
    return options.beforeDescribe;
  }
  if (isTestIdentifier(node, sourceFile)) {
    return options.beforeIt;
  }
  return 0;
}

function getFailureString(node: ts.Node, sourceFile: ts.SourceFile, options: IOptions) {
  let noOfLines = getNoOfNewLineCharsNeededForTOI(node, sourceFile, options) - 1;
  const TOIname = node.getText(sourceFile);
  return `Should contain at least ${noOfLines} blank lines before ${TOIname}`;
}
