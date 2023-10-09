import { PrimaryGeneratedColumn, Entity, Column, Unique, UpdateDateColumn, ObjectIdColumn, CreateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Common } from '../../shared/entities/common.entity';

@Entity()
export class Point extends Common {

    @PrimaryGeneratedColumn()
    id: number

    @Column('eventType')
    eventType: string;

    @Column({})
    param: Object

}
