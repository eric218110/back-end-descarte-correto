import { AccountModel } from '@domain/models/account'

export interface LoadAccountById {
  load: (id: string) => Promise<AccountModel>
}
