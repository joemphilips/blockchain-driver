import { createLogger, TRACE } from 'bunyan';
/* tslint:disable-next-line:no-duplicate-imports */
import * as Logger from 'bunyan';
import PrettyStream from 'bunyan-prettystream';
/* tslint:disable:no-duplicate-imports */

const getLogger = (debugFile: string): Logger => {
  const prettyStdOut = new PrettyStream();
  prettyStdOut.pipe(process.stdout);
  return createLogger({
    name: 'walletts',
    src: true,
    streams: [
      {
        name: 'stdout',
        level: 'info',
        stream: prettyStdOut
      },
      {
        name: 'debugStream',
        level: TRACE,
        path: debugFile
      }
    ]
  });
};

export default getLogger;
