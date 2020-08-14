import { Router } from 'express'
import { addpterRoute } from '../adapters/express/express-route-adapter'
import { makeSignUpController } from '../factories/controllers/signup/signup-controller-factory'
import { makeLoginController } from '../factories/controllers/login/login-controller-factory'

export default (router: Router): void => {
  router.post('/signup', addpterRoute(makeSignUpController()))
  router.post('/login', addpterRoute(makeLoginController()))
}
