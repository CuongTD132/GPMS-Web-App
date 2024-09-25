import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'statusClass',
})
export class StatusClassPipe implements PipeTransform {
    transform(value: string): string {
        switch (value) {
            case 'Approved':
            case 'Active':
                return 'bg-green-500 text-white rounded-full px-3 py-1';
            case 'InProduction':
            case 'In_production':
            case 'Finished':
                return 'bg-blue-500 text-white rounded-full px-3 py-1';
            case 'Pending':
                return 'bg-yellow-500 text-white rounded-full px-3 py-1';
            case 'Declined':
                return 'bg-red-500 text-white rounded-full px-3 py-1';
            case 'Failed':
                return 'bg-gray-500 text-white rounded-full px-3 py-1';
            case 'InProgress':
            case 'Passed':
                return 'bg-teal-500 text-white rounded-full px-3 py-1';
            default:
                return 'rounded-full border border-gray-500 px-3 py-1 text-gray-500';
        }
    }
}
