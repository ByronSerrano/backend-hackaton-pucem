import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePlatoDto } from './dto/create-plato.dto';
import { UpdatePlatoDto } from './dto/update-plato.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Insumo } from './entities/insumo.entity';
import { In, Repository } from 'typeorm';
import { CreateInsumoDto } from './dto/create-insumo.dto';
import { Plato } from './entities/plato.entity';

@Injectable()
export class PlatosService {
  private readonly logger = new Logger(PlatosService.name);
  menuRepository: any;
  
  constructor(
    @InjectRepository(Insumo)
    private insumoRepository: Repository<Insumo>,

    @InjectRepository(Plato)
    private platoRepository: Repository<Plato>,
  ) {}

  async create(createPlatoDto: CreatePlatoDto) {
    try {
      const plato = this.platoRepository.create({
        nombre: createPlatoDto.nombre,
        descripcion: createPlatoDto.descripcion,
      });

      // Si se proporciona menuId, buscar y asignar el menu
      if (createPlatoDto.menuId) {
        const menu = await this.menuRepository.findOne({ 
          where: { id: createPlatoDto.menuId } 
        });
        if (!menu) {
          throw new NotFoundException(`Menu with ID ${createPlatoDto.menuId} not found`);
        }
        plato.menu = menu;
      }

      // Si se proporcionan insumoIds, buscar y asignar los insumos
      if (createPlatoDto.insumoIds && createPlatoDto.insumoIds.length > 0) {
        const insumos = await this.insumoRepository.findBy({
          id: In(createPlatoDto.insumoIds)
        });
        if (insumos.length !== createPlatoDto.insumoIds.length) {
          throw new NotFoundException('Some insumos were not found');
        }
        plato.insumos = insumos;
      }

      const savedPlato = await this.platoRepository.save(plato);
      this.logger.log(`Plato created: ${savedPlato.nombre}`);
      return savedPlato;
    } catch (error) {
      this.logger.error('Error creating plato', error);
      throw error;
    }
  }

  createInsumo(insumoDto: CreateInsumoDto) {
    const insumo = this.insumoRepository.create(insumoDto);
    return this.insumoRepository.save(insumo)
      .then(savedInsumo => {
        this.logger.log(`Insumo created: ${savedInsumo.nombre}`);
        return savedInsumo;
      })
      .catch(error => {
        this.logger.error('Error creating insumo', error);
        throw error;
      });
  }

  findAll() {
    return this.platoRepository.find({ relations: ['insumos'] })
      .then(platos => {
        this.logger.log(`Found ${platos.length} platos`);
        return platos;
      })
      .catch(error => {
        this.logger.error('Error finding platos', error);
        throw error;
      });
  }

  findOne(id: number) {
    return `This action returns a #${id} plato`;
  }

  update(id: number, updatePlatoDto: UpdatePlatoDto) {
    return `This action updates a #${id} plato`;
  }

  remove(id: number) {
    return `This action removes a #${id} plato`;
  }
}
