import { NgModule } from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {AssociationsRoutingModule} from './associations-routing.module';
import { AssociationsReviewComponent } from './containers/associations-review/associations-review.component';
import {ImgUploadFormComponent} from './components/img-upload-form/img-upload-form.component';
import { TextAreaFormComponent } from './components/text-area-form/text-area-form.component';
import { AddPositionFormComponent } from './components/add-position-form/add-position-form.component';
import {PositionsListComponent} from './components/positions-list.component';


@NgModule({
  declarations: [
    AssociationsReviewComponent,
    ImgUploadFormComponent,
    TextAreaFormComponent,
    AddPositionFormComponent,
    PositionsListComponent
  ],
  imports: [
    SharedModule,
    AssociationsRoutingModule
  ]
})
export class AssociationsModule { }
