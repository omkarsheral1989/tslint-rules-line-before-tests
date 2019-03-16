const util = require('util');

export const completeLog = (message?: any, ...optionalParams: any[]): undefined => {
  if (process.env.LOGS === 'true') {
    console.log(message, ...optionalParams.map(
      (param) => util.inspect(param, false, 4))
    );
  }
  return undefined;
};
