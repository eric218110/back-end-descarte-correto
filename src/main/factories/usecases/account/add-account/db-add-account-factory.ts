import { AccountTypeOrmRepository } from '@infra/db/typeorm/repositories/account/account-typeorm-repository'
import { BCryptAdapter } from '@infra/criptography/brcypt-adapter/brcypt-adapter'
import env from '@main/config/env'
import { DbAddAccount } from '@data/usecases/account/add-account/db-add-account'
import { AddAccount } from '@domain/usecases/account/add-account'

export const makeDbAddAccount = (): AddAccount => {
  const addAccountRepository = new AccountTypeOrmRepository()
  const encrypter = new BCryptAdapter(env.SALT)
  return new DbAddAccount(encrypter, addAccountRepository, addAccountRepository)
}
