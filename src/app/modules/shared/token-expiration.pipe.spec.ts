import { TokenExpirationPipe } from './token-expiration.pipe';

describe('TokenExpirationPipe', () => {
  it('create an instance', () => {
    const pipe = new TokenExpirationPipe();
    expect(pipe).toBeTruthy();
  });
});
