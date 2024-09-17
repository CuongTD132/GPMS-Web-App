// color-status.module.ts
import { NgModule } from '@angular/core';
import { ColorPipe } from './color/color.pipe';
import { StatusClassPipe } from './status-class-pipe/status-class.pipe';

@NgModule({
    declarations: [ColorPipe, StatusClassPipe],
    imports: [],
    exports: [ColorPipe, StatusClassPipe],
})
export class CustomPipeModule {}
