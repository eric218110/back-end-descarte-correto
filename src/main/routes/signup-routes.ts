import { Router } from 'express'
import { makeSignUpController } from '../factories/signup'
import { addpterRoute } from '../adapter/express-route-adapter'

export default (router: Router): void => {
  router.post('/signup', addpterRoute(makeSignUpController()))
}
