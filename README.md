# tslint-rules-line-before-tests

TSLint rule to check and fix the minimum number of lines before test cases.
<br/>i.e. `describe()`, `xdescribe()`, `it()`, `xit()`, `test()`, `xtest()`.  


## Install

Install the package using NPM:
    
    npm install tslint-rules-line-before-tests --save-dev

Update your `tslint.json` file to extend this package:

```json
{
  "rulesDirectory": [
    "tslint-rules-line-before-tests"
  ],
  "rules": {
    "line-before-tests": true
  }
}
```

## Rules

### `line-before-tests`
Checks minimum number of lines before test cases.

#### Has Fixer
Yes

#### Config
Takes optional object with following optional properties:
* `"beforeDescribe"` minimum number of blank lines before `describe()`, `xdescribe()`. Default value = 2. To disable, set to -1.
* `"beforeIt"` minimum number of blank lines before `it()`, `xit()`, `test()`, `xtest()`. Default value = 1. To disable, set to -1.

##### Config examples
```
"line-before-tests": [true]
```
```
"line-before-tests": [true, {beforeDescribe: 2, beforeIt: 1}]
```
```
"line-before-tests": [true, {beforeDescribe: 2}]
```
```
"line-before-tests": [true, {beforeIt: 1}]
```
```
"line-before-tests": [true, {beforeDescribe: 2, beforeIt: -1}]
```
```
"line-before-tests": [true, {beforeDescribe: -1, beforeIt: 1}]
```

#### Test files
If you are interested to see exactly where it will throw error,
you can take a look at tests:

<br/>

For below configuration, check test file [here](TODO update link).
```
"line-before-tests": [true, {beforeDescribe: 2, beforeIt: -1}]
```
<br/>

For below configuration, check test file [here](TODO update link).
```
"line-before-tests": [true, {beforeDescribe: -1, beforeIt: 1}]
```

## Development

```sh
# build
yarn build

# test
yarn test
```
