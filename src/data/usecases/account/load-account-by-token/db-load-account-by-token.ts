import { LoadAccountByToken } from '@domain/usecases/account/load-accout-by-token'
import { Decrypter } from '@data/protocols/criptography/decrypter'
import { AccountModel } from '../add-account/db-add-account-protocols'
import { LoadAccountByTokenRepository } from '@data/protocols/data/account/load-by-token-repository'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load(accessToken: string, role?: string): Promise<AccountModel> {
    const token = await this.decrypter.decrypt(accessToken)
    if (token) {
      return await this.loadAccountByTokenRepository.loadByToken(
        accessToken,
        role
      )
    }
    return null
  }
}
