import { Controller } from '@presentation/protocols'
import { LoginController } from '@presentation/controllers/account/login/login-controller'
import { makeLoginValidator } from './login-validator-factory'
import { makeDbAuthentication } from '@main/factories/usecases/authentication/db-authentication-factory'
import { makeLoggerControllerDecorator } from '@main/factories/decorators/logger-controller/logger-controller-decorator-factory'

export const makeLoginController = (): Controller => {
  const loginController = new LoginController(makeDbAuthentication(), makeLoginValidator())
  return makeLoggerControllerDecorator(loginController)
}
