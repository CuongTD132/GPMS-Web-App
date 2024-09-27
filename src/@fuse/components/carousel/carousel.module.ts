import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CarouselComponent } from './carousel.component';
import { MatIcon } from '@angular/material/icon';

@NgModule({
    declarations: [CarouselComponent],
    imports: [CommonModule, MatIcon],
    exports: [CarouselComponent],
})
export class CarouselModule {}
