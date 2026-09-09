import { AuthService } from "./auth-types";
import { DemoAuthService } from "./demo-auth-service";

export const auth: AuthService = new DemoAuthService();

