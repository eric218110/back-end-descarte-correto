import { Controller } from '../../../presentation/protocols'
import { LoggerControllerDecorator } from '../../decorators/logger-decorator'
import { LoginController } from '../../../presentation/controllers/login/login-controller'
import { LoggerMongoRepository } from '../../../infra/db/mongodb/logger/logger-mongo-repository'
import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication'
import { makeLoginValidator } from './login-validator-factory'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { BCryptAdapter } from '../../../infra/criptography/brcypt-adapter/brcypt-adapter'
import { JwtAdapter } from '../../../infra/criptography/jwt-adapter/jwt-adapter'
import env from '../../config/env'

export const makeLoginController = (): Controller => {
  const accountMongoRepository = new AccountMongoRepository()
  const bcrypterAdapter = new BCryptAdapter(env.salt)
  const jwtAdapter = new JwtAdapter(env.jwt_secret)
  const dbAuthentication = new DbAuthentication(
    accountMongoRepository,
    bcrypterAdapter,
    jwtAdapter,
    accountMongoRepository
  )
  const loginController = new LoginController(dbAuthentication, makeLoginValidator())
  const loggerMongoRepository = new LoggerMongoRepository()
  return new LoggerControllerDecorator(loginController, loggerMongoRepository)
}
