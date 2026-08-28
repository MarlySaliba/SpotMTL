import { Controller, Get, Inject, Query } from "@nestjs/common";
import type { Attraction } from "./attraction.types";
import { AttractionsService } from "./attractions.service";
import type { AttractionsQueryDto } from "./dto/attractions-query.dto";
import { AttractionsQueryValidationPipe } from "./dto/attractions-query-validation.pipe";

@Controller("attractions")
export class AttractionsController {
  constructor(
    @Inject(AttractionsService)
    private readonly attractionsService: AttractionsService,
  ) {}

  @Get()
  findAll(
    @Query(new AttractionsQueryValidationPipe()) query: AttractionsQueryDto,
  ): Promise<Attraction[]> {
    return this.attractionsService.findAll(query);
  }
}
