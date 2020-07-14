import { Pipe, PipeTransform } from '@angular/core';
import { parseToken } from './util';

@Pipe({
  name: 'tokenExpiration'
})
export class TokenExpirationPipe implements PipeTransform {

  transform(value: string): Date {
    const token = parseToken(value);

    if (!token.exp) {
      // return today's date by default
      return new Date();
    }

    return new Date(token.exp * 1000);
  }

}
