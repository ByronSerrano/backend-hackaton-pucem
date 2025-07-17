import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CategoriaMenu } from './categoria_menu.entity';

@Entity()
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ type: 'boolean', default: true, name: 'precio_unitario' })
  precioUnitario: boolean;

  @Column({ type: 'text' })
  imagenUrl: string;

  @OneToOne(() => CategoriaMenu, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'categoriaMenuId' })
  categoriaMenu: CategoriaMenu | null;

  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
