import Imap from 'imap';
import { ParsedMail, simpleParser } from 'mailparser';
import { Err, Ok, Result } from 'ts-results-es';

export class EmailService {
  private readonly _clientConfig: Imap.Config;

  constructor(clientConfig: Imap.Config) {
    this._clientConfig = clientConfig;
  }

  /**
   * Get an email by a search query.
   * @param searchCriteria The search criteria to use to find the email. See
   * https://github.com/mscdex/node-imap?tab=readme-ov-file#connection-instance-methods for more information
   * on valid search criteria.
   * @returns A promise that resolves to a Result containing the email if successful, or an error if not.
   */
  async getEmailByQuery(searchCriteria: unknown[]): Promise<Result<ParsedMail, Error>> {
    const client = new Imap(this._clientConfig);

    return new Promise(resolve => {
      client.once('ready', () => {
        client.openBox('INBOX', false, err => {
          if (err) {
            return resolve(Err(err));
          }

          client.search(searchCriteria, (err, results) => {
            if (err) {
              return resolve(Err(err));
            }

            if (results.length === 0) {
              return resolve(Err(new Error('No emails found.')));
            }

            const f = client.fetch(results, {
              bodies: '',
              markSeen: true,
            });

            f.on('message', msg => {
              msg.on('body', stream => {
                simpleParser(stream as never, (err, email) => {
                  if (err) {
                    return resolve(Err(err));
                  }

                  return resolve(Ok(email));
                });
              });
            });

            f.once('error', err => resolve(Err(err)));

            f.once('end', () => client.end());
          });
        });
      });

      client.connect();
    });
  }
}
