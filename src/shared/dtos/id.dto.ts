import { IsNotEmpty, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class IdDTO {

  /**
   * 主键 id
   */
  @IsNotEmpty({ message: 'id 不能为空' })
  @ApiProperty({ example: 1 })
  readonly id: number

  @ApiProperty({ example: false })
  readonly publish:boolean
}