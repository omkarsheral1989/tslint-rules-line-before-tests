export interface IOptions {
  beforeDescribe: number;
}

export const defaultOptions: IOptions = {
  beforeDescribe: 2,
};

/**
 * This needs to be done as by default every describe() is on new line. hence noOfBlankLines=newLineChars-1
 */
export function incrementOptionsNumbersBy1(options: IOptions) {
  options.beforeDescribe++;
}
