import { SignUpController } from '../../../../presentation/controllers/signup/signup-controller'
import { Controller } from '../../../../presentation/protocols'
import { makeSignUpValidator } from './signup-validator-factory'
import { makeDbAddAccount } from '../../usecases/add-account/db-add-account-factory'
import { makeDbAuthentication } from '../../usecases/authentication/db-authentication-factory'
import { makeLoggerControllerDecorator } from '../../decorators/logger-controller/logger-controller-decorator-factory'

export const makeSignUpController = (): Controller => {
  const signUpController = new SignUpController(makeDbAddAccount(), makeSignUpValidator(), makeDbAuthentication())
  return makeLoggerControllerDecorator(signUpController)
}
