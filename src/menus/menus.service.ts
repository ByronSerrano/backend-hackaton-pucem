import { Injectable, Logger, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
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

  async create(createMenuDto: CreateMenuDto): Promise<Menu> {
    try {
      // Validar precio positivo
      if (createMenuDto.precioUnitario <= 0) {
        throw new BadRequestException('El precio unitario debe ser mayor a 0');
      }

      // Verificar que el nombre no esté duplicado
      const menuExistente = await this.menuRepository.findOne({
        where: { nombre: createMenuDto.nombre }
      });

      if (menuExistente) {
        throw new ConflictException(`Ya existe un menú con el nombre: ${createMenuDto.nombre}`);
      }

      const menu = this.menuRepository.create({
        nombre: createMenuDto.nombre,
        descripcion: createMenuDto.descripcion,
        precioUnitario: createMenuDto.precioUnitario,
        imagenUrl: createMenuDto.imagenUrl,
        estado: createMenuDto.estado ?? true,
        categoriaId: createMenuDto.categoriaId,
      });

      // Si se proporciona categoriaId, buscar y validar la categoría
      if (createMenuDto.categoriaId) {
        const categoriaMenu = await this.categoriaMenuRepository.findOne({
          where: { categoriaId: createMenuDto.categoriaId }
        });
        if (!categoriaMenu) {
          throw new NotFoundException(`Categoría con ID ${createMenuDto.categoriaId} no encontrada`);
        }
      }

      const savedMenu = await this.menuRepository.save(menu);
      this.logger.log(`Menú creado: ${savedMenu.nombre}`);
      return savedMenu;
    } catch (error) {
      if (error instanceof BadRequestException || 
          error instanceof NotFoundException || 
          error instanceof ConflictException) {
        throw error;
      }
      this.logger.error('Error creating menu', error);
      throw new BadRequestException('Error al crear el menú');
    }
  }

  async createCategoria(createCategoriaMenuDto: CreateCategoriaMenuDto): Promise<CategoriaMenu> {
    try {
      // Verificar que el nombre no esté duplicado
      const categoriaExistente = await this.categoriaMenuRepository.findOne({
        where: { nombre: createCategoriaMenuDto.nombre }
      });

      if (categoriaExistente) {
        throw new ConflictException(`Ya existe una categoría con el nombre: ${createCategoriaMenuDto.nombre}`);
      }

      const categoriaMenu = this.categoriaMenuRepository.create({
        nombre: createCategoriaMenuDto.nombre,
        descripcion: createCategoriaMenuDto.descripcion,
        estado: createCategoriaMenuDto.estado ?? true,
      });

      const savedCategoria = await this.categoriaMenuRepository.save(categoriaMenu);
      this.logger.log(`Categoría creada: ${savedCategoria.nombre}`);
      return savedCategoria;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      this.logger.error('Error creating categoria menu', error);
      throw new BadRequestException('Error al crear la categoría');
    }
  }

  async findAll(): Promise<Menu[]> {
    try {
      const menus = await this.menuRepository.find({
        relations: ['categoria'],
        order: { createdAt: 'DESC' }
      });
      this.logger.log(`Found ${menus.length} menus`);
      return menus;
    } catch (error) {
      this.logger.error('Error finding menus', error);
      throw new BadRequestException('Error al obtener los menús');
    }
  }

  async findAllCategorias(): Promise<CategoriaMenu[]> {
    try {
      const categorias = await this.categoriaMenuRepository.find({
        order: { createdAt: 'DESC' }
      });
      this.logger.log(`Found ${categorias.length} categorias`);
      return categorias;
    } catch (error) {
      this.logger.error('Error finding categorias', error);
      throw new BadRequestException('Error al obtener las categorías');
    }
  }

  async findOne(id: number): Promise<Menu> {
    if (!id || id <= 0) {
      throw new BadRequestException('ID del menú debe ser un número válido');
    }

    try {
      const menu = await this.menuRepository.findOne({
        where: { menuId: id },
        relations: ['categoria']
      });
      if (!menu) {
        throw new NotFoundException(`Menú con ID ${id} no encontrado`);
      }
      this.logger.log(`Found menu: ${menu.nombre}`);
      return menu;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Error finding menu with ID ${id}`, error);
      throw new BadRequestException('Error al buscar el menú');
    }
  }

  async update(id: number, updateMenuDto: UpdateMenuDto): Promise<Menu> {
    // Verificar que el menú existe
    const menu = await this.findOne(id);

    // Validar precio si se está actualizando
    if (updateMenuDto.precioUnitario && updateMenuDto.precioUnitario <= 0) {
      throw new BadRequestException('El precio unitario debe ser mayor a 0');
    }

    // Verificar nombre único si se está actualizando
    if (updateMenuDto.nombre && updateMenuDto.nombre !== menu.nombre) {
      const menuExistente = await this.menuRepository.findOne({
        where: { nombre: updateMenuDto.nombre }
      });
      
      if (menuExistente) {
        throw new ConflictException(`Ya existe un menú con el nombre: ${updateMenuDto.nombre}`);
      }
    }

    // Validar categoría si se está actualizando
    if (updateMenuDto.categoriaId) {
      const categoriaMenu = await this.categoriaMenuRepository.findOne({
        where: { categoriaId: updateMenuDto.categoriaId }
      });
      if (!categoriaMenu) {
        throw new NotFoundException(`Categoría con ID ${updateMenuDto.categoriaId} no encontrada`);
      }
    }

    try {
      // Actualizar campos
      Object.assign(menu, updateMenuDto);
      
      const updatedMenu = await this.menuRepository.save(menu);
      this.logger.log(`Menu updated: ${updatedMenu.nombre}`);
      return updatedMenu;
    } catch (error) {
      this.logger.error(`Error updating menu with ID ${id}`, error);
      throw new BadRequestException('Error al actualizar el menú');
    }
  }

  async remove(id: number): Promise<void> {
    const menu = await this.findOne(id);

    try {
      await this.menuRepository.remove(menu);
      this.logger.log(`Menu removed: ${menu.nombre}`);
    } catch (error) {
      this.logger.error(`Error removing menu with ID ${id}`, error);
      throw new BadRequestException('Error al eliminar el menú. Puede tener pedidos asociados.');
    }
  }

  // Métodos adicionales útiles

  async findByCategoria(categoriaId: number): Promise<Menu[]> {
    return await this.menuRepository.find({
      where: { categoriaId },
      relations: ['categoria'],
      order: { nombre: 'ASC' }
    });
  }

  async findActivos(): Promise<Menu[]> {
    return await this.menuRepository.find({
      where: { estado: true },
      relations: ['categoria'],
      order: { nombre: 'ASC' }
    });
  }

  async count(): Promise<number> {
    return await this.menuRepository.count();
  }

  async countActivos(): Promise<number> {
    return await this.menuRepository.count({
      where: { estado: true }
    });
  }
}