import { Component, Renderer, NgZone } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { DataStore } from '../../app/dataStore';
import { BankbotPage } from '../bankbot/bankbot';
import { ChequePage } from '../cheque/cheque';
import { BillpayPage } from '../billpay/billpay';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  constructor(
    public navCtrl: NavController,
    public renderer: Renderer,
    public dataStore: DataStore
  ) {
    this.getAccountSummary();
  }
  username = this.dataStore.username || 'User';
  name = '';
  cardNumber = '';
  balance = 0;

  transactionList = [];

  page(pageName) {
    switch (pageName) {
      case 'transfer':
        // this.navCtrl.push();
        break;
      case 'bill':
        this.navCtrl.push(BillpayPage);
        break;
      case 'chat':
        this.navCtrl.push(BankbotPage);
        break;
      case 'cheque':
        this.navCtrl.push(ChequePage);
        break;
    }
  }

  getAccountSummary() {
    var resourceRequest = new WLResourceRequest(
      'http://purplebank-purplebank.builder-support-c33bf0f22ab59313b3628c493e016b88-0000.us-south.containers.appdomain.cloud/account',
      WLResourceRequest.GET,
      { useAPIProxy: false }
    );
    var self = this;
    resourceRequest.send().then(
      function(response) {
        // alert('Success: ' + response.responseText);
        var res = JSON.parse(response.responseText);
        self.cardNumber = res.accountNumber;
        self.name = res.name;
        self.balance = res.balance;
        self.transactionList = res.recentTransactions;
      },
      function(response) {
        alert('Failure: ' + JSON.stringify(response));
      }
    );
  }
}
