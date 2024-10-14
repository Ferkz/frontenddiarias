import { LoginComponent } from './components/login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { ModalComponent } from './components/modal/modal.component';
import { ListaDiariasComponent } from './components/lista-diarias/lista-diarias.component';
import { FormcadastroComponent } from './components/formcadastro/formcadastro.component';

const routes: Routes = [
  {path:'',component:FormcadastroComponent},
  {path:'login',component:LoginComponent},
  {path:'params',component: ModalComponent},
  {path:'lista-diarias',component: ListaDiariasComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
