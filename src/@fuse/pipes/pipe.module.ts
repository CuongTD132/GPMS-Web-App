// color-status.module.ts
import { NgModule } from '@angular/core';
import { ColorPipe } from './color/color.pipe';

@NgModule({
    declarations: [ColorPipe],
    imports: [],
    exports: [ColorPipe],
})
export class CustomPipeModule { }
