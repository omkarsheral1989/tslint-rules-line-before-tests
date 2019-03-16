# tslint-rules-line-before-tests

TSLint rule to check and fix the number of lines before test cases.
<br/>i.e. `describe()`, `it()`, `xdescribe()`, `xit()`.  


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

### Rules


#### `line-before-tests`

##### Options

## Development

```sh
# build
yarn build

# test
yarn test
```
