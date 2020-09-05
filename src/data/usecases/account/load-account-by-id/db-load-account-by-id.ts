import { LoadAccountById } from '@domain/usecases/account/load-account-by-id'
import { AccountModel } from '@domain/models/account'
import { LoadAccountByIdRepository } from '@data/protocols/data/account/load-by-id-repository'

export class DbLoadAccountById implements LoadAccountById {
  constructor(
    private readonly loadAccountByIdRepository: LoadAccountByIdRepository
  ) {}

  async load(id: string): Promise<AccountModel> {
    await this.loadAccountByIdRepository.loadById(id)
    return null
  }
}
