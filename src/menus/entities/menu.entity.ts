import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CategoriaMenu } from './categoria_menu.entity';

@Entity('MENUS')
export class Menu {
  @ApiProperty({
    description: 'ID único del menú',
    example: 1
  })
  @PrimaryGeneratedColumn({ name: 'menu_id' })
  menuId: number;

  @ApiProperty({
    description: 'Nombre del menú',
    example: 'Menú Ejecutivo'
  })
  @Column({ type: 'varchar', length: 150, nullable: false })
  nombre: string;

  @ApiProperty({
    description: 'Descripción del menú',
    example: 'Menú completo para el almuerzo ejecutivo'
  })
  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @ApiProperty({
    description: 'Precio unitario del menú en dólares',
    example: 25.50
  })
  @Column({ 
    name: 'precio_unitario',
    type: 'decimal', 
    precision: 10, 
    scale: 2, 
    nullable: false 
  })
  precioUnitario: number;

  @ApiProperty({
    description: 'ID de la categoría del menú',
    example: 1
  })
  @Column({ name: 'categoria_id', type: 'int', nullable: true })
  categoriaId: number;

  @ApiProperty({
    description: 'Estado del menú (disponible/no disponible)',
    example: true
  })
  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @ApiProperty({
    description: 'URL de la imagen del menú',
    example: 'https://example.com/menu.jpg'
  })
  @Column({ name: 'imagen_url', type: 'text', nullable: true })
  imagenUrl: string;

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

  // Relación con CategoriaMenu
  @ApiProperty({
    description: 'Información de la categoría del menú',
    type: () => CategoriaMenu
  })
  @ManyToOne(() => CategoriaMenu, { eager: true })
  @JoinColumn({ name: 'categoria_id' })
  categoria: CategoriaMenu;

  // Relación con Platos (para futuro)
  // @OneToMany(() => Plato, plato => plato.menu)
  // platos: Plato[];
}