import { AccountModel } from '../../../../domain/models/account'

export interface LoadAccountByEmailRepository {
  loadWithEmail: (email: string) => Promise<AccountModel>
}
