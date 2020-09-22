import { PointModel } from '@domain/models/point'
import { AccountModel } from '@domain/models/account'

type AccountModelOmitPassword = Omit<AccountModel, 'password' | 'role'>
type LoadItemsModelOmitAccount = Omit<PointModel, 'account'>

export interface LoadPointsModel extends LoadItemsModelOmitAccount {
  account: AccountModelOmitPassword
}

export interface LoadPoints {
  load: () => Promise<LoadPointsModel[]>
}
