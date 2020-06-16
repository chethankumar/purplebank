import { Component, Renderer, NgZone, NgModule } from '@angular/core';
import {
  NavController,
  ModalController,
  LoadingController
} from 'ionic-angular';
import { DataStore } from '../../app/dataStore';
import { LiveUpdateProvider } from '../../providers/live-update/live-update';

@Component({
  selector: 'page-billpay',
  templateUrl: 'billpay.html'
})
@NgModule({
  providers: [LiveUpdateProvider]
})
export class BillpayPage {
  constructor(
    public navCtrl: NavController,
    public dataStore: DataStore,
    public liveUpdateService: LiveUpdateProvider
  ) {
    LiveUpdateManager.obtainConfiguration(
      {
        useClientCache: true
      },
      function(configuration) {
        // Control a feature using live update

        var myFeature = configuration.features['offerbanner'];
        if (myFeature !== undefined) {
          (<HTMLElement>document.getElementById('offerBanner')).style.display =
            myFeature == true ? 'block' : 'none';
        }
      },
      function(error) {
        console.log(
          'ObtainConfiguration failed with error: ' + JSON.stringify(error)
        );
      }
    );
  }

  upcomingList = [
    {
      bill: 'Broadband Bill',
      desc: 'Airtel',
      amt: '$400'
    },
    {
      bill: 'Broadband Bill',
      desc: 'Airtel',
      amt: '$400'
    }
  ];

  recentList = [
    {
      bill: 'Electricity Bill',
      desc: 'BESCOM',
      amt: '$1400'
    },
    {
      bill: 'Phone Bill',
      desc: 'Airtel',
      amt: '$400'
    }
  ];
}
