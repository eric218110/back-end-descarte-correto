import { SignUpController } from '../../../presentation/controllers/signup/signup'
import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'
import { BCryptAdapter } from '../../../infra/criptography/brcypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account-repository/account'
import { Controller } from '../../../presentation/protocols'
import { LoggerControllerDecorator } from '../../decorators/logger'
import { LoggerMongoRepository } from '../../../infra/db/mongodb/logger-repositoty/logger-mongo-repository'
import { makeSignUpValidator } from './signup-validator'

export const makeSignUpController = (): Controller => {
  const salt = 12
  const addAccountRepository = new AccountMongoRepository()
  const loggerMongoRepository = new LoggerMongoRepository()
  const encrypter = new BCryptAdapter(salt)
  const addAccount = new DbAddAccount(encrypter, addAccountRepository)
  const signUpController = new SignUpController(addAccount, makeSignUpValidator())
  return new LoggerControllerDecorator(signUpController, loggerMongoRepository)
}
