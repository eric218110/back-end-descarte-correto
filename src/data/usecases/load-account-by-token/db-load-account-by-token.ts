import { LoadAccountByToken } from '@domain/usecases/load-accout-by-token'
import { Decrypter } from '@data/protocols/criptography/decrypter'
import { AccountModel } from '../account/db-add-account-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter
  ) {}

  async load (accessToken: string, role?: string): Promise<AccountModel> {
    await this.decrypter.decrypt(accessToken)
    return null
  }
}
