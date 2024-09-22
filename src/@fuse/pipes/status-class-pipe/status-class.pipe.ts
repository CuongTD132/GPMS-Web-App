import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'statusClass',
})
export class StatusClassPipe implements PipeTransform {
    transform(value: string): string {
        switch (value) {
            case 'Approved':
                return 'bg-green-500 text-white rounded-full px-3 py-1';
            case 'InProgress':
                return 'bg-blue-500 text-white rounded-full px-3 py-1';
            case 'InProduction':
                return 'bg-yellow-500 text-white rounded-full px-3 py-1';
            case 'Pending':
                return 'bg-orange-500 text-white rounded-full px-3 py-1';
            case 'Declined':
                return 'bg-red-500 text-white rounded-full px-3 py-1';
            case 'Finished':
                return 'bg-purple-500 text-white rounded-full px-3 py-1';
            case 'Failed':
                return 'bg-gray-500 text-white rounded-full px-3 py-1';
            case 'Passed':
                return 'bg-teal-500 text-white rounded-full px-3 py-1';
            default:
                return 'rounded-full border border-gray-500 px-3 py-1 text-gray-500';
        }
    }
}
