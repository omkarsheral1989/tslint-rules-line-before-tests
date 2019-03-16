const util = require('util');

export const completeLog = (message?: any, ...optionalParams: any[]): undefined => {
  if (process.env.LOGS === 'true') {
    console.log(message, ...optionalParams.map(
      (param) => util.inspect(param, false, (process.env.LOGS_DEPTH || 2) as number))
    );
  }
  return undefined;
};
