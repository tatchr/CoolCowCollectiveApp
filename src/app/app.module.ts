import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule } from '@angular/common/http';
import { Storage, IonicStorageModule } from '@ionic/storage';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';

import { Ionic4DatepickerModule } from '@logisticinfotech/ionic4-datepicker';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { CowBaseComponent } from 'src/app/pages/cows/cow-base/cow-base.component';
import { MilkSalesBaseComponent } from 'src/app/pages/sales/milk-sales/milk-sales-base/milk-sales-base.component';
import { OtherSalesBaseComponent } from 'src/app/pages/sales/other-sales/other-sales-base/other-sales-base.component';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

export function jwtOptionsFactory(storage) {
  return {
    tokenGetter: () => {
      return storage.get('access_token');
    },
    whitelistedDomains: ['localhost:44395', 'coolcowcollective.azurewebsites.net']
  }
}

@NgModule({
  declarations: [AppComponent, CowBaseComponent, MilkSalesBaseComponent, OtherSalesBaseComponent],
  entryComponents: [CowBaseComponent, MilkSalesBaseComponent, OtherSalesBaseComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, 
    HttpClientModule,
    Ionic4DatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    IonicStorageModule.forRoot(),
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [Storage],
      }
    }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    StatusBar,
    SplashScreen,
    File,
    FileOpener,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
