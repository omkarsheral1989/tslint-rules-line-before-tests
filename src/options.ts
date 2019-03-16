export interface IOptions {
  beforeDescribe: number;
  beforeIt: number;
}

export const defaultOptions: IOptions = {
  beforeDescribe: 2,
  beforeIt: 1,
};

/**
 * This needs to be done as by default every describe() is on new line. hence noOfBlankLines=newLineChars-1
 */
export function incrementOptionsNumbersBy1(options: IOptions) {
  options.beforeDescribe++;
  options.beforeIt++;
}
