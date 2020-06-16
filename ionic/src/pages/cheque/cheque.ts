import { Component, Renderer, NgZone, NgModule } from '@angular/core';
import {
  NavController,
  ModalController,
  LoadingController,
  Platform
} from 'ionic-angular';
import { DataStore } from '../../app/dataStore';
import { LiveUpdateProvider } from '../../providers/live-update/live-update';
import WatsonVisualRecognition from '../../componentScripts/watsonvr';

@Component({
  selector: 'page-cheque',
  templateUrl: 'cheque.html'
})
@NgModule({
  providers: [LiveUpdateProvider]
})
export class ChequePage {
  url = 'https://gateway.watsonplatform.net/visual-recognition/api';
  apikey = 'mt8IeKrbZNqArbR_lDCe9ywGbMi2GpxGAEb4RyTKyMQt';
  modelId = 'cheque_357278589';
  watsonVisualRecognition: WatsonVisualRecognition;

  constructor(
    public navCtrl: NavController,
    public dataStore: DataStore,
    public liveUpdateService: LiveUpdateProvider,
    private zone: NgZone,
    private platform: Platform
  ) {
    this.watsonVisualRecognition = new WatsonVisualRecognition(
      this.apikey,
      this.url,
      this.modelId,
      zone,
      platform
    );
  }
  viewPlatform: string = '';
  ngOnInit() {
    document.getElementById('spinner').style.visibility = 'hidden';
  }
  ionViewWillEnter() {
    if (this.platform.is('core')) {
      this.viewPlatform = 'web';
    } else {
      this.viewPlatform = 'mobile';
    }
  }
  ionViewDidLoad() {}

  takePicture(e) {
    this.watsonVisualRecognition.takePicture(
      document.getElementById('vr-logoimg'),
      document.getElementById('result'),
      document.getElementById('spinner'),
      document.getElementById('vr-result'),
      (err, res) => {
        const id =
          e.target.parentNode.parentNode.parentNode.attributes['studio-id']
            .value;
        this.dataStore[id.split('_')[0]][id]['watson_vr_text'] = res;
      }
    );
  }
  chooseFromGallery(e) {
    this.watsonVisualRecognition.chooseFromGallery(
      document.getElementById('vr-logoimg'),
      document.getElementById('result'),
      document.getElementById('spinner'),
      document.getElementById('vr-result'),
      (err, res) => {
        const id =
          e.target.parentNode.parentNode.parentNode.attributes['studio-id']
            .value;
        this.dataStore[id.split('_')[0]][id]['watson_vr_text'] = res;
      }
    );
  }

  uploadImagefromWeb(e) {
    var self = this;
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.onloadend = function() {
      const imageBase64 = reader.result.replace('data:image/png;base64,', '');
      self.watsonVisualRecognition.uploadForWeb(
        imageBase64,
        document.getElementById('vr-logoimg'),
        document.getElementById('result'),
        document.getElementById('spinner'),
        document.getElementById('vr-result'),
        (err, res) => {}
      );
    };
    reader.readAsDataURL(file);
  }
}
