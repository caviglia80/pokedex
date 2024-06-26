import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { isValidObjectId, Model } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class PokemonService {
  private defaultLimit: number;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService
  ) {
    this.defaultLimit = this.configService.get<number>('defaultLimit');
  }

  async create(createPokemonDto: CreatePokemonDto) {
    try {
      createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = this.defaultLimit, offset = 0 } = paginationDto;
    return await this.pokemonModel.find()
      .limit(limit)
      .skip(offset)
      .sort({ no: 1 })
      .select('-__v'); //evito mandar esa columna 
  }

  async findOne(term: string) {
    let pokemon: Pokemon;
    if (isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    } else if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    }
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: term.toLocaleLowerCase().trim() });
    }
    if (!pokemon) throw new NotFoundException(`Pokemon ${term} not found.`);
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    try {
      const pokemon = await this.findOne(term);
      if (updatePokemonDto.name) updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase()
      await pokemon.updateOne(updatePokemonDto);
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
    if (deletedCount === 0) throw new BadRequestException(`Pokemon with id "${id}" not found.`);
    return;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(`Pokemon exists in db: ${JSON.stringify(error.keyValue)}`);
    }
    throw new InternalServerErrorException(`Pokemon error.`);
  }
}
