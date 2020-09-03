import { SignUpController } from '@presentation/controllers/account/signup/signup-controller'
import { Controller } from '@presentation/protocols'
import { makeSignUpValidator } from './signup-validator-factory'
import { makeDbAddAccount } from '@main/factories/usecases/account/add-account/db-add-account-factory'
import { makeDbAuthentication } from '@main/factories/usecases/account/authentication/db-authentication-factory'
import { makeLoggerControllerDecorator } from '@main/factories/decorators/logger-controller/logger-controller-decorator-factory'

export const makeSignUpController = (): Controller => {
  const signUpController = new SignUpController(
    makeDbAddAccount(),
    makeSignUpValidator(),
    makeDbAuthentication()
  )
  return makeLoggerControllerDecorator(signUpController)
}
