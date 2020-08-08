import bcrypt from 'bcrypt'
import { Encrypter } from '../../data/protocols/encripter'

export class BCryptAdapter implements Encrypter {
  constructor (private readonly salt: number) {
    this.salt = salt
  }

  async encript (value: string): Promise<string> {
    await bcrypt.hash(value, this.salt)
    return new Promise(resolve => resolve(''))
  }
}
