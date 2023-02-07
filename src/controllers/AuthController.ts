import { ContainerCradle } from "../container.types";
import AuthRepository from "../repositories/AuthRepository";
import { RouteHandlerWithBody, PossibleErrorResponse } from "../routes/routes.types";
import { isSame } from "../utils/crypto";
import { LoginRequest, LoginResponse } from "./AuthController.types";

class AuthController {
  repository: AuthRepository;

  constructor({ authRepository }: ContainerCradle) {
    this.repository = authRepository;
  }

  login: RouteHandlerWithBody<LoginRequest, PossibleErrorResponse<LoginResponse>> = async (req, reply) => {
    const { email, password } = req.body;

    console.log(email, password);
    const user = await this.repository.getUserByEmail(email);

    if (!user) {
      return reply.code(401).send({ error: "Incorrect user name or password" });
    }

    if (!isSame(password, user.password)) {
      return reply.code(401).send({ error: "Incorrect user name or password" });
    }

    const token = await this.repository.createTokenForUser(user.id);

    return reply.code(200).send({
      user: {
        id: user.id,
        email: user.email,
      },
      token,
    });
  };
}

export default AuthController;
