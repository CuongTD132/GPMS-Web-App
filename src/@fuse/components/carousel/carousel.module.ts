import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CarouselComponent } from './carousel.component';

@NgModule({
    declarations: [CarouselComponent],
    imports: [CommonModule],
    exports: [CarouselComponent],
})
export class CarouselModule {}
