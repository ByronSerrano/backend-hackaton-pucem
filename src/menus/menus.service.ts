import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from './entities/menu.entity';
import { Repository } from 'typeorm';
import { CategoriaMenu } from './entities/categoria_menu.entity';
import { CreateCategoriaMenuDto } from './dto/create-categoria-menu.dto';

@Injectable()
export class MenusService {
  private readonly logger = new Logger(MenusService.name);

  constructor(
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,

    @InjectRepository(CategoriaMenu)
    private categoriaMenuRepository: Repository<CategoriaMenu>,
  ) {}

  async create(createMenuDto: CreateMenuDto) {
    try {
      const menu = this.menuRepository.create({
        nombre: createMenuDto.nombre,
        descripcion: createMenuDto.descripcion,
        precioUnitario: createMenuDto.precioUnitario ?? true,
        imagenUrl: createMenuDto.imagenUrl,
        estado: createMenuDto.estado ?? true,
      });

      // Si se proporciona categoriaMenuId, buscar y asignar la categoría
      if (createMenuDto.categoriaMenuId) {
        const categoriaMenu = await this.categoriaMenuRepository.findOne({
          where: { id: createMenuDto.categoriaMenuId }
        });
        if (!categoriaMenu) {
          throw new NotFoundException(`CategoriaMenu with ID ${createMenuDto.categoriaMenuId} not found`);
        }
        menu.categoriaMenu = categoriaMenu;
      }

      const savedMenu = await this.menuRepository.save(menu);
      this.logger.log(`Menu created: ${savedMenu.nombre}`);
      return savedMenu;
    } catch (error) {
      this.logger.error('Error creating menu', error);
      throw error;
    }
  }

  async createCategoria(createCategoriaMenuDto: CreateCategoriaMenuDto) {
    try {
      const categoriaMenu = this.categoriaMenuRepository.create({
        nombre: createCategoriaMenuDto.nombre,
        descripcion: createCategoriaMenuDto.descripcion,
        estado: createCategoriaMenuDto.estado ?? true,
      });

      const savedCategoria = await this.categoriaMenuRepository.save(categoriaMenu);
      this.logger.log(`CategoriaMenu created: ${savedCategoria.nombre}`);
      return savedCategoria;
    } catch (error) {
      this.logger.error('Error creating categoria menu', error);
      throw error;
    }
  }

  async findAll() {
    try {
      const menus = await this.menuRepository.find({
        relations: ['categoriaMenu'],
        order: { createdAt: 'DESC' }
      });
      this.logger.log(`Found ${menus.length} menus`);
      return menus;
    } catch (error) {
      this.logger.error('Error finding menus', error);
      throw error;
    }
  }

  async findAllCategorias() {
    try {
      const categorias = await this.categoriaMenuRepository.find({
        order: { createdAt: 'DESC' }
      });
      this.logger.log(`Found ${categorias.length} categorias`);
      return categorias;
    } catch (error) {
      this.logger.error('Error finding categorias', error);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const menu = await this.menuRepository.findOne({
        where: { id },
        relations: ['categoriaMenu']
      });
      if (!menu) {
        throw new NotFoundException(`Menu with ID ${id} not found`);
      }
      this.logger.log(`Found menu: ${menu.nombre}`);
      return menu;
    } catch (error) {
      this.logger.error(`Error finding menu with ID ${id}`, error);
      throw error;
    }
  }

  update(id: number, updateMenuDto: UpdateMenuDto) {
    return `This action updates a #${id} menu`;
  }

  remove(id: number) {
    return `This action removes a #${id} menu`;
  }
}
