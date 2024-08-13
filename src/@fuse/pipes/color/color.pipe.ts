import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'colorStatus',
})
export class ColorStatusPipe implements PipeTransform {
    transform(value: string): string {
        switch (value) {
            case 'Red':
                return 'text-red-500'; // Replace 'text-red' with your desired CSS class
            case 'Green':
                return 'text-green-500'; // Replace 'text-green' with your desired CSS class
            case 'Blue':
                return 'text-blue-500'; // Replace 'text-blue' with your desired CSS class
            default:
                return ''; // Default class if no match
        }
    }
}
