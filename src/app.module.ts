import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DbModule } from './db/db.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [DbModule, AuthModule, PostModule],
})
export class AppModule {}
