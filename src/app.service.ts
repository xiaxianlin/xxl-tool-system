import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async getHello() {
    const saltOrRounds = 10;
    const password = 'Xiaxl.901208';
    const hash = await bcrypt.hash(password, saltOrRounds);
    const isMatch = await bcrypt.compare(
      password,
      '$2b$10$//eVsIivYHnf0UzFk/oaAeKQwP7kFZW3loRri1uk8xLHvRhKRuc7G',
    );
    return 'test:' + isMatch;
  }
}
