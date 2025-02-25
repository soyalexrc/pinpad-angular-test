import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {PinPad, PinPadClient} from "@placetopay/pinpad-sdk";

const URL = 'https://pinpad-dev.placetopay.ws'
// const URL = 'https://pinpad-UAT.placetopay.ws'
const TOKEN = '189|KB38AU9OTgMORAIcrihdy5HP2yTduHsfVTxHh1Em'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'pinpad-angular-test';

  transactionId = '';
  pinpad = new PinPad({
    mode: 'static'
  });
  client = new PinPadClient(URL, TOKEN)


  interval: any;

  async ngOnInit(): Promise<void> {
    await this.createTransaction();
  }



  async createTransaction() {
    try {
      const response = await this.client.createTransaction();
      const positions = response.data.data.positions.split('').join(',')
      await this.pinpad.render('#pinpad-render', positions);
      this.transactionId = response.data.data.transactionId;
    } catch (error) {
      console.error(error);
    }
  }

  onSubmit(event: Event) {
    event.preventDefault();

    const form = event.target as HTMLFormElement
    const formData = new FormData(form);
    const pin = formData.get('pin') as string;

    const format = 0;
    const data = {
      transactionId: this.transactionId,
      format,
      pin,
      pan: 123481203912,
    }


    this.client.generatePinBlock(data)
      .then(res => {
        console.log(res)
        // this.flashPaymentService.controller.pinBlock = res.data.data.pinblock;
        // this.flashPaymentService.stepUpdate(2)
      }).catch(err => {
      console.log('catch', err)
    })

    if (pin) {
      console.log('PIN Submitted:', pin);
    } else {
      console.error('No PIN received');
    }
  }

}
