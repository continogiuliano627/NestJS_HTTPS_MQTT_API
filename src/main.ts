import {NestFactory} from '@nestjs/core';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import {AppModule} from './app.module';
dotenv.config();
const bootstrap = async (): Promise<void> => {
	const app = await NestFactory.create(AppModule);
	const swaggerConfig = new DocumentBuilder()
		.setTitle('IoT Server API')
		.setDescription('API for a IoT set with HTTPS interface & mosquitto mqtt broker')
		.setVersion('1.0.0')
		.build();
	const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
	SwaggerModule.setup('docs', app, swaggerDocument);
	await app.listen(process.env.API_PORT ?? 4625);
};
void bootstrap();
