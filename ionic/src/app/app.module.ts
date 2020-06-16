import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { DataStore } from './dataStore';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LiveUpdateProvider } from '../providers/live-update/live-update';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { BankbotPage } from '../pages/bankbot/bankbot';
import { ChequePage } from '../pages/cheque/cheque';
import { BillpayPage } from '../pages/billpay/billpay';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    BankbotPage,
    ChequePage,
    BillpayPage
  ],
  imports: [BrowserModule, IonicModule.forRoot(MyApp)],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    BankbotPage,
    ChequePage,
    BillpayPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    DataStore,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    LiveUpdateProvider
  ]
})
export class AppModule {}
