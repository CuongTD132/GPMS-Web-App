import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function maxQuantityValidator(maxQuantity: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        return value > maxQuantity
            ? { maxQuantity: { value: maxQuantity } }
            : null;
    };
}
