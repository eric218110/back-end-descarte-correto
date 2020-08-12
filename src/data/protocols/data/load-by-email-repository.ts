import { AccountModel } from '../../../domain/models/account'

export interface LoadByEmailRepository {
  loadWithEmail: (email: string) => Promise<AccountModel>
}
