import { SetMetadata } from '@nestjs/common';
import { Roles } from './roles.enum';

export const RolesRequired = (...roles: Roles[]) => SetMetadata('roles', roles);
