import { AddAccountRepository } from '@data/protocols/data/account/add-account-repository'
import { AccountModelData, AddAccountModel } from '@data/models/account-model'
import { Repository, getRepository } from 'typeorm'
import { EntityAccount } from '../../entities/account.entity'

export class AccountTypeOrmRepository implements AddAccountRepository {
  private readonly AccountTypeOrmRepository: Repository<EntityAccount>

  constructor () {
    this.AccountTypeOrmRepository = getRepository(EntityAccount)
  }

  async add (account: AddAccountModel): Promise<AccountModelData> {
    const createAccount = this.AccountTypeOrmRepository.create(account)
    await this.AccountTypeOrmRepository.save(createAccount)
    return createAccount
  }
}
