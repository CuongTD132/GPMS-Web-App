import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'statusClass',
})
export class StatusClassPipe implements PipeTransform {
    transform(value: string): string {
        switch (value) {
            case 'Approved':
                return 'rounded-full border border-green-500 px-3 py-1 text-green-500';
            case 'InProgress':
                return 'rounded-full border border-blue-500 px-3 py-1 text-blue-500';
            case 'InProduction':
                return 'rounded-full border border-yellow-500 px-3 py-1 text-yellow-500';
            case 'Pending':
                return 'rounded-full border border-orange-500 px-3 py-1 text-orange-500';
            case 'Decline':
                return 'rounded-full border border-red-500 px-3 py-1 text-red-500';
            case 'Finished':
                return 'rounded-full border border-purple-500 px-3 py-1 text-purple-500';
            default:
                return 'rounded-full border border-gray-500 px-3 py-1 text-gray-500';
        }
    }
}
