import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('CLIENTES')
export class Cliente {
  @ApiProperty({
    description: 'ID único del cliente',
    example: 1
  })
  @PrimaryGeneratedColumn({ name: 'cliente_id' })
  clienteId: number;

  @ApiProperty({
    description: 'Nombre del cliente',
    example: 'Juan'
  })
  @Column({ type: 'varchar', nullable: false })
  nombre: string;

  @ApiProperty({
    description: 'Apellido del cliente',
    example: 'Pérez'
  })
  @Column({ type: 'varchar', nullable: false })
  apellido: string;

  @ApiProperty({
    description: 'Número de teléfono',
    example: '+593999123456',
    required: false
  })
  @Column({ type: 'varchar', nullable: true })
  telefono: string;

  @ApiProperty({
    description: 'Correo electrónico único',
    example: 'juan.perez@email.com',
    required: false
  })
  @Column({ type: 'varchar', unique: true, nullable: true })
  email: string;

  @ApiProperty({
    description: 'Dirección completa del cliente',
    example: 'Av. Principal 123, Centro',
    required: false
  })
  @Column({ type: 'text', nullable: true })
  direccion: string;

  @ApiProperty({
    description: 'Ciudad de residencia',
    example: 'Portoviejo',
    required: false
  })
  @Column({ type: 'varchar', nullable: true })
  ciudad: string;

  @ApiProperty({
    description: 'Código postal',
    example: '130105',
    required: false
  })
  @Column({ name: 'codigo_postal', type: 'varchar', nullable: true })
  codigoPostal: string;

  @ApiProperty({
    description: 'Estado del cliente (activo/inactivo)',
    example: true,
    default: true
  })
  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @ApiProperty({
    description: 'Fecha de creación del registro',
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

  // Virtual property - Nombre completo
  @ApiProperty({
    description: 'Nombre completo del cliente',
    example: 'Juan Pérez'
  })
  get nombreCompleto(): string {
    return `${this.nombre} ${this.apellido}`;
  }

  // Las relaciones las manejamos desde el lado de Pedidos
  // No necesitamos definir @OneToMany aquí para evitar dependencias circulares
}