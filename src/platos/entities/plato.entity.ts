import { Menu } from '@/src/menus/entities/menu.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Insumo } from './insumo.entity';

@Entity()
export class Plato {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'text' })
  descripcion: string;

  @ManyToOne(() => Menu, (menu) => menu.id, { nullable: true })
  menu: Menu | null;

  @ManyToMany(() => Insumo)
  @JoinTable({
    name: 'plato_insumos',
    joinColumn: { name: 'platoId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'insumoId', referencedColumnName: 'id' }
  })
  insumos: Insumo[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}
