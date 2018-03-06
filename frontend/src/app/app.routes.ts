import { Routes } from '@angular/router'

import { AboutPage } from './pages/about/about.component'
import { HomePage } from './pages/home/home.component'
import { SendPage } from './pages/send/send.component'
import { StatusPage } from './pages/status/status.component'

export const routes: Routes = [
  { path: '', component: HomePage},
  { path: 'send', component: SendPage},
  { path: 'about', component: AboutPage},
  { path: 'status/:id', component: StatusPage},
  { path: '**', redirectTo: ''},
]
