import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';

@Entity()
export class AppBaseEntity implements EntitySubscriberInterface<any> {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column({ default: 'System' })
  createdBy: Date;

  @Column({ default: 'System' })
  updatedBy: Date;

  beforeInsert(event: InsertEvent<any>) {
    console.log(`BEFORE ENTITY INSERTED: `, event.entity);
    event.entity.createdBy = 'system';
  }

  beforeUpdate(event: UpdateEvent<any>) {
    console.log(`BEFORE ENTITY UPDATED: `, event.entity);
    event.entity.updatedBy = 'system';
  }
}
