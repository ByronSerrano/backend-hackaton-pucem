import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('CATEGORIAS_MENU')
export class CategoriaMenu {
  @ApiProperty({
    description: 'ID único de la categoría',
    example: 1
  })
  @PrimaryGeneratedColumn({ name: 'categoria_id' })
  categoriaId: number;
  
  @ApiProperty({
    description: 'Nombre de la categoría',
    example: 'Desayunos'
  })
  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  nombre: string;

  @ApiProperty({
    description: 'Descripción de la categoría',
    example: 'Menús para eventos matutinos'
  })
  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @ApiProperty({
    description: 'Estado de la categoría (activo/inactivo)',
    example: true
  })
  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2025-07-17T14:30:00Z'
  })
  @CreateDateColumn({ 
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2025-07-17T14:30:00Z'
  })
  @UpdateDateColumn({ 
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  updatedAt: Date;

  // Relación con Menús (una categoría puede tener muchos menús)
  // @OneToMany(() => Menu, menu => menu.categoria)
  // menus: Menu[];
}