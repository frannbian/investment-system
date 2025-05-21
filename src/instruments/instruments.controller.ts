import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateInstrumentDto } from './dtos/create-instrument.dto';
import { InstrumentsService } from './instruments.service';
import { UpdateInstrumentDto } from './dtos/update-instrument.dto';

@Controller('instruments')
export class InstrumentsController {
  constructor(private readonly instrumentService: InstrumentsService) {}

  @Get()
  findAll() {
    return this.instrumentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.instrumentService.findOne(id);
  }

  @Post()
  create(@Body() createOrderDto: CreateInstrumentDto) {
    return this.instrumentService.create(createOrderDto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInstrumentDto: UpdateInstrumentDto,
  ) {
    return this.instrumentService.update(id, updateInstrumentDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.instrumentService.remove(id);
  }
}
