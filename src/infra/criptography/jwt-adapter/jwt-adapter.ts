import jsonwebtoken from 'jsonwebtoken'
import { Encrypter } from '@data/protocols/criptography/encripter'

export class JwtAdapter implements Encrypter {
  constructor (
    private readonly secret: string
  ) {}

  async encript (value: string): Promise<string> {
    const accessToken = await jsonwebtoken.sign({ id: value }, this.secret)
    return accessToken
  }
}
