import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthResponse } from './dto/types/auth-response.type';
import { LoginInput, SignupInput } from './dto/inputs';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorator/current-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation( () => AuthResponse , { name:'signin' })
  signUp(
    @Args('signupInput') signupInput: SignupInput
  ):Promise<AuthResponse>  {
    return this.authService.signUp(signupInput)
  }

  @Mutation( () => AuthResponse, { name: 'login' })
  login(
    @Args('loginInput') loginInput:LoginInput
  ):Promise<AuthResponse>  {
    return this.authService.login(loginInput)
  }

  @Query( () => AuthResponse, { name:'revalite' })
  @UseGuards( JwtAuthGuard )
  async revalidateToken(
    @CurrentUser() user:User
  ) {

    return this.authService.revalidateToken(user);
  }
}
