import { ApiProperty } from '@nestjs/swagger';

export class DatabaseModel {
}

export class IdDatabaseModel extends DatabaseModel {
  @ApiProperty()
  id: string;
}
