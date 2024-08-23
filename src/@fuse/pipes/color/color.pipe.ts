import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'color',
})
export class ColorPipe implements PipeTransform {
    transform(value: string): string {
        value = value.toLocaleLowerCase();
        switch (value) {
            case 'đỏ':
                return 'bg-red-300';
            case 'cam':
                return 'bg-orange-300';
            case 'vàng':
                return 'bg-yellow-300';
            case 'lục':
                return 'bg-green-300';
            case 'xanh':
                return 'bg-blue-300';
            case 'xám':
                return 'bg-gray-300';
            case 'hồng':
                return 'bg-pink-300';
            case 'tím':
                return 'bg-purple-300';
            default:
                return ''; // Default class if no match
        }
    }
}
