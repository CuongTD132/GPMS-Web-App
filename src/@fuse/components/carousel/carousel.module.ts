import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { CarouselComponent } from './carousel.component';

@NgModule({
    declarations: [CarouselComponent],
    imports: [CommonModule, MatIcon],
    exports: [CarouselComponent],
})
export class CarouselModule {}
