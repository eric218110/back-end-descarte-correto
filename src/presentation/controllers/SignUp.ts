import { IHttpRequest, IHttpResponse, IController, IEmailValidator } from '../protocols'
import { MissingParamsError, InvalidParamError } from '../errors'
import { badRequest, serverError } from '../helper/httpHelper'
import { AddAccount } from '../domain/usecases/AddAccount'

export class SignUpController implements IController {
  private readonly emailValidator: IEmailValidator
  private readonly addAccount: AddAccount

  constructor (emailValidator: IEmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  public handle (httpRequest: IHttpRequest): IHttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamsError(field))
        }
      }
      const { name, email, password, passwordConfirmation } = httpRequest.body
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
      this.addAccount.add({
        name,
        email,
        password
      })
    } catch (error) {
      return serverError()
    }
  }
}
