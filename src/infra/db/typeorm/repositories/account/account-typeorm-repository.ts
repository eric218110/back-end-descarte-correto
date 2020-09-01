import { AddAccountRepository } from '@data/protocols/data/account/add-account-repository'
import { AccountModelData, AddAccountModel } from '@data/models/account-model'
import { Repository, getRepository } from 'typeorm'
import { EntityAccount } from '../../entities/account.entity'
import { LoadAccountByTokenRepository } from '@data/protocols/data/account/load-by-token-repository'

export class AccountTypeOrmRepository
implements AddAccountRepository, LoadAccountByTokenRepository {
  private readonly AccountTypeOrmRepository: Repository<EntityAccount>

  constructor () {
    this.AccountTypeOrmRepository = getRepository(EntityAccount)
  }

  async add (account: AddAccountModel): Promise<AccountModelData> {
    const createAccount = this.AccountTypeOrmRepository.create(account)
    await this.AccountTypeOrmRepository.save(createAccount)
    return createAccount
  }

  async loadByToken (token: string, role: string = 'user'): Promise<AccountModelData> {
    const account = await this.AccountTypeOrmRepository
      .createQueryBuilder('account')
      .where(`account.accessToken = '${token}'`)
      .andWhere(`(account.role = '${role}' OR account.role = 'admin')`)
      .getOne()
    if (account === undefined) return null
    return account
  }
}
