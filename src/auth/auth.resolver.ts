import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignupInput } from './dto/inputs/signup.input';
import { AuthResponse } from './dto/inputs/types/auth-response.type';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation( () => AuthResponse , { name:'signin' })
  signUp(
    @Args('signupInput') signupInput: SignupInput
  ):Promise<AuthResponse>  {
    return this.authService.signUp(signupInput)
  }

  @Mutation( () => String, { name: 'login' })
  login() {
    // return this.authService.login()
  }

  @Query( () => String, { name:'revalite' })
  async revalidateToken() {
    // return this.authService.revalidateToken()
  }
}
