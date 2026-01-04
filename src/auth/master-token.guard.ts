import type {CanActivate, ExecutionContext} from '@nestjs/common';
import {ForbiddenException, Injectable} from '@nestjs/common';
import type {Request} from 'express';

@Injectable()
export class MasterTokenGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		const validToken = process.env.MASTER_TOKEN;
		if (!validToken?.length) throw new Error('Cant get valid token');
		const req = context.switchToHttp().getRequest<Request>();
		const rawToken = req.headers['x-master-token'];

		if (typeof rawToken !== 'string') throw new ForbiddenException('Master token missing');

		if (rawToken !== validToken) throw new ForbiddenException('Invalid master token');

		return true;
	}
}
