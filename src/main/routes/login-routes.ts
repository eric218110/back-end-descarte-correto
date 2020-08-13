import { Router } from 'express'
import { addpterRoute } from '../adapters/express/express-route-adapter'
import { makeSignUpController } from '../factories/signup/signup-factory'
import { makeLoginController } from '../factories/login/login-factory'

export default (router: Router): void => {
  router.post('/signup', addpterRoute(makeSignUpController()))
  router.post('/login', addpterRoute(makeLoginController()))
}
