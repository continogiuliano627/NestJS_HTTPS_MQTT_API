import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';

const bootstrap = async (): Promise<void> => {
	const app = await NestFactory.create(AppModule);
	await app.listen(process.env.API_PORT ?? 4625);
};
void bootstrap();
