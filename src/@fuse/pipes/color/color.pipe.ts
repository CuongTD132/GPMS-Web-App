import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'colorStatus',
})
export class ColorStatusPipe implements PipeTransform {
    transform(value: string): string {
        switch (value) {
            case 'Red':
                return 'text-red-500';
            case 'Orange':
                return 'text-orange-500';
            case 'Yellow':
                return 'text-yellow-500';
            case 'Green':
                return 'text-green-500';
            case 'Blue':
                return 'text-blue-500';
            case 'Gray':
                return 'text-gray-500';
            case 'Pink':
                return 'text-pink-500';
            case 'Purple':
                return 'text-purple-500';
            default:
                return ''; // Default class if no match
        }
    }
}
