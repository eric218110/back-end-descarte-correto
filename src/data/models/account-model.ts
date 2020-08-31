import { AccountModel } from '@domain/models/account'

export type AccountModelData = AccountModel
export type AddAccountModel = Omit<AccountModel, 'id'>
