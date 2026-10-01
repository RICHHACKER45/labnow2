import { Component, OnInit, OnDestroy, NgZone, ChangeDetectorRef } from '@angular/core';
import { IonHeader,IonToolbar,IonTitle,IonContent,IonButton,IonCard,IonCardHeader,IonCardTitle,IonCardContent,} from '@ionic/angular';
import { Motion, AccelListenerEvent } from '@capacitor/motion';
import { PluginListenerHandle } from '@capacitor/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [IonHeader,IonToolbar,IonTitle,IonContent,IonButton,IonCard,IonCardHeader,IonCardTitle,IonCardContent,],
})


export class HomePage implements OnInit, OnDestroy {
  // variables ni dice roller
  number = 1;
  shaking = false;

  private motionListener?: PluginListenerHandle;

  constructor(private ngZone: NgZone, private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    // kukunin ang acceleration ng phone kapag nag start sila sa app
    await this.getAccel();
  }

  async getAccel() {
    // ito ang mag l listen sa accel ng phone para ma detect ang pag shake
    this.motionListener = await Motion.addListener('accel', (event: AccelListenerEvent) => {
      // accel sa x
      const x = event.acceleration?.x || 0;

      // dito nadedetect ang shake kapag umabot nasya sa threshold ng 5 m/s^2 
      if (Math.abs(x) > 5   && !this.shaking) {
        this.ngZone.run(() => {
          this.shaking = true;
          this.rollDice();

          // pineprevent na mag trigger ang motion like kapag nag shake habang nag roroll ang dice
          setTimeout(() => {
            this.shaking = false;
            this.cdr.detectChanges();
          }, 1000);

          // para ma update ang dice
          this.cdr.detectChanges();
        });
      }
    });
  }

  rollDice() {
    // mag generate ng number random from 1-6
    this.number = Math.floor(Math.random() * 6) + 1;
  }

  async ngOnDestroy() {
    // linisin ang motion listener kapag umalis sila sa app
    if (this.motionListener) {
      await this.motionListener.remove();
    }
  }
}