import { ContainerCradle } from "../container.types";
import AuthRepository from "../repositories/AuthRepository";

class AuthController {
  repository: AuthRepository;

  constructor({ authRepository }: ContainerCradle) {
    this.repository = authRepository;
  }

  // async login(req: Request, h: ResponseToolkit) {
  //   try {
  //     const { email, password } = req.payload;
  //     return {
  //       email,
  //     };
  //   } catch (e) {
  //     console.log(e);
  //     return h.response({ error: e }).code(500);
  //   }
  // }
}

export default AuthController;
