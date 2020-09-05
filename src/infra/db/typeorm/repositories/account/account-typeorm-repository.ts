import {
  Repository,
  getRepository,
  EntityAccount,
  AccountModelData,
  AddAccountModel,
  AddAccountRepository,
  LoadAccountByEmailRepository,
  LoadAccountByTokenRepository,
  UpdateAccessTokenRepository
} from './account-typeorm-repository-protocols'
import { LoadAccountByIdRepository } from '@data/protocols/data/account/load-by-id-repository'
export class AccountTypeOrmRepository
  implements
    LoadAccountByEmailRepository,
    AddAccountRepository,
    LoadAccountByTokenRepository,
    LoadAccountByIdRepository,
    UpdateAccessTokenRepository {
  private readonly AccountTypeOrmRepository: Repository<EntityAccount>

  constructor() {
    this.AccountTypeOrmRepository = getRepository(EntityAccount)
  }

  async add(account: AddAccountModel): Promise<AccountModelData> {
    const createAccount = this.AccountTypeOrmRepository.create(account)
    await this.AccountTypeOrmRepository.save(createAccount)
    return createAccount
  }

  async loadWithEmail(email: string): Promise<AccountModelData> {
    return (await this.AccountTypeOrmRepository.findOne({ email })) || null
  }

  async loadByToken(
    token: string,
    role: string = 'user'
  ): Promise<AccountModelData> {
    const account = await this.AccountTypeOrmRepository.createQueryBuilder(
      'account'
    )
      .where(`account.accessToken = '${token}'`)
      .andWhere(`(account.role = '${role}' OR account.role = 'admin')`)
      .getOne()

    return account || null
  }

  async updateAccessToken(id: string, token: string): Promise<void> {
    const account = await this.AccountTypeOrmRepository.findOne({ id })
    if (account) {
      const { id } = account
      await this.AccountTypeOrmRepository.update({ id }, { accessToken: token })
    }
    return null
  }

  async loadById(id: string): Promise<AccountModelData> {
    const account = await this.AccountTypeOrmRepository.findOne({ id })
    return account
  }
}
