import { AddAccountRepository } from '@data/protocols/data/account/add-account-repository'
import { AccountModelData, AddAccountModel } from '@data/models/account-model'
import { Repository, getRepository } from 'typeorm'
import { EntityAccount } from '../../entities/account.entity'
import { LoadAccountByTokenRepository } from '@data/protocols/data/account/load-by-token-repository'
import { LoadAccountByEmailRepository } from '@data/protocols/data/account/load-by-email-repository'
import { UpdateAccessTokenRepository } from '@data/protocols/data/account/update-access-token-repository'

export class AccountTypeOrmRepository implements
LoadAccountByEmailRepository,
AddAccountRepository,
LoadAccountByTokenRepository,
UpdateAccessTokenRepository {
  private readonly AccountTypeOrmRepository: Repository<EntityAccount>

  constructor () {
    this.AccountTypeOrmRepository = getRepository(EntityAccount)
  }

  async add (account: AddAccountModel): Promise<AccountModelData> {
    const createAccount = this.AccountTypeOrmRepository.create(account)
    await this.AccountTypeOrmRepository.save(createAccount)
    return createAccount
  }

  async loadWithEmail (email: string): Promise<AccountModelData> {
    return await this.AccountTypeOrmRepository.findOne({ email }) || null
  }

  async loadByToken (token: string, role: string = 'user'): Promise<AccountModelData> {
    const account = await this.AccountTypeOrmRepository
      .createQueryBuilder('account')
      .where(`account.accessToken = '${token}'`)
      .andWhere(`(account.role = '${role}' OR account.role = 'admin')`)
      .getOne()

    return account || null
  }

  async updateAccessToken (id: string, token: string): Promise<void> {
    const account = await this.AccountTypeOrmRepository.findOne({ id })
    if (account) {
      const { id } = account
      await this.AccountTypeOrmRepository.update({ id }, { accessToken: token })
    }
    return null
  }
}
