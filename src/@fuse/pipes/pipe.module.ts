// color-status.module.ts
import { NgModule } from '@angular/core';
import { ColorStatusPipe } from './color/color.pipe';

@NgModule({
    declarations: [ColorStatusPipe],
    imports: [],
    exports: [ColorStatusPipe],
})
export class CustomPipeModule {}
