import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ClassSerializerInterceptor } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: '*',
  });
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector))); // Agregar interceptor global , nos permite transformar las respuestas

  const config = new DocumentBuilder()
    .setTitle('API INNOVACORE')
    .setDescription(
      'Documentación de la API para la gestion del sanatorio de rosario',
    )
    .setVersion('1.0')
    .addBearerAuth() // Si usás JWT o auth
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Application is running on: http://0.0.0.0:${port}`);
  console.log(
    `📚 Swagger documentation available at: http://localhost:${port}/api`,
  );
}
bootstrap();
