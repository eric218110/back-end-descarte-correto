import { SignUpController } from '../../../presentation/controllers/signup/signup-controller'
import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'
import { BCryptAdapter } from '../../../infra/criptography/brcypt-adapter/brcypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { Controller } from '../../../presentation/protocols'
import { LoggerControllerDecorator } from '../../decorators/logger-decorator'
import { LoggerMongoRepository } from '../../../infra/db/mongodb/logger/logger-mongo-repository'
import { makeSignUpValidator } from './signup-validator-factory'

export const makeSignUpController = (): Controller => {
  const salt = 12
  const addAccountRepository = new AccountMongoRepository()
  const loggerMongoRepository = new LoggerMongoRepository()
  const encrypter = new BCryptAdapter(salt)
  const addAccount = new DbAddAccount(encrypter, addAccountRepository)
  const signUpController = new SignUpController(addAccount, makeSignUpValidator())
  return new LoggerControllerDecorator(signUpController, loggerMongoRepository)
}
