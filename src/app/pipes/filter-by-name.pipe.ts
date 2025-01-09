import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByName'
})
export class FilterByNamePipe implements PipeTransform {

  transform(diarias: any[], searchName: string): any[] {
    if (!diarias || !searchName) {
      return diarias;
    }
    return diarias.filter(d => d.nome.toLowerCase().includes(searchName.toLowerCase()));
  }

}
