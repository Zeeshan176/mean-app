import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
///////
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { PostSocketService } from "./post-socket.service";
//////

import { PostCreateComponent } from "./post-create/post-create.component";
import { PostListComponent } from "./post-list/post-list.component";
import { AngularMaterialModule } from "../angular-material.module";
import { environment } from "src/environments/environment";
//////
const socketIoConfig: SocketIoConfig = {
  url: environment.socketUrl, options: {}
};
//////

@NgModule({
  declarations: [PostCreateComponent, PostListComponent],
  imports: [
    SocketIoModule.forRoot(socketIoConfig),
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule
  ],
  providers: [
    PostSocketService
  ]
})
export class PostsModule {}
