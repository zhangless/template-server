import { PrimaryGeneratedColumn, Entity, Column, Unique, UpdateDateColumn, ObjectIdColumn, CreateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { ObjectId } from 'mongoose';
import { Common } from '../../shared/entities/common.entity';
@Entity()
export class Upload extends Common {

    @PrimaryGeneratedColumn()
    id: number

    @Column('text')
    address: string;

    @Column()
    userId: ObjectId

}
