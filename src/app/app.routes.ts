import { Routes } from '@angular/router';

import { DemoPage } from './pages/demo/demo.component';
import { AboutPage } from './pages/about/about.component';
import { HomePage } from './pages/home/home.component';
import { SendPage } from './pages/send/send.component';

export const routes: Routes = [
  { path: 'demo', component: DemoPage},
  { path: '', component: HomePage},
  { path: 'send', component: SendPage},
  { path: 'about', component: AboutPage},
];
