import { Controller, Delete, Get, Param, Post } from "@nestjs/common";

import { ReportsService } from "./reports.service";

@Controller("reports")
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  create() {
    return this.reportsService.create();
  }

  @Get()
  findAll() {
    return this.reportsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.reportsService.findOne(+id);
  }

  // @Patch(":id")
  // update(@Param("id") id: string, @Body() updateReportDto: UpdateReportDto) {
  //   return this.reportsService.update(+id, updateReportDto);
  // }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.reportsService.remove(+id);
  }
}
