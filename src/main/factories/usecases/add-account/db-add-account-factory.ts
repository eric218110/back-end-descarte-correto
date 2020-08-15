import { AccountMongoRepository } from '@infra/db/mongodb/account/account-mongo-repository'
import { BCryptAdapter } from '@infra/criptography/brcypt-adapter/brcypt-adapter'
import env from '@main/config/env'
import { DbAddAccount } from '@data/usecases/add-account/db-add-account'
import { AddAccount } from '@domain/usecases/add-account'

export const makeDbAddAccount = (): AddAccount => {
  const addAccountRepository = new AccountMongoRepository()
  const encrypter = new BCryptAdapter(env.salt)
  return new DbAddAccount(encrypter, addAccountRepository, addAccountRepository)
}
