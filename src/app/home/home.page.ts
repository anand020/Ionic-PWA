import { Component } from '@angular/core';
import { BackgroundGeolocation, BackgroundGeolocationConfig } from '@ionic-native/background-geolocation/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  tracking;
  speed = 0;
  lat;
  long;
  taskKey

  constructor(private backgroundGeolocation: BackgroundGeolocation) {}

  startGettingSpeed(){

    this.startTracking();

  }

  stopTracking() {
    clearInterval(this.tracking);
    this.backgroundGeolocation.stop();
    this.backgroundGeolocation.endTask(this.taskKey);
  }


  startTracking() {
    // Background Tracking
    const config: BackgroundGeolocationConfig = {
      desiredAccuracy: 10,
      stationaryRadius: 20,
      distanceFilter: 30,
      debug: false, //  enable this hear sounds for background-geolocation life-cycle.
      stopOnTerminate: false, // enable this to clear background location settings when the app terminates
      interval:1000
    };
    this.tracking = setInterval(() => {
      this.backgroundGeolocation.configure(config)
        .then((data) => {
          // this.backgroundGeolocation.on(BackgroundGeolocationEvents.location).subscribe((location: BackgroundGeolocationResponse) => {
          this.backgroundGeolocation.getCurrentLocation().then((location) => {
            // console.log("location", location);
            if (location) {
              this.lat = location.latitude;
              this.long = location.longitude;
              this.speed = this.speed = Number.isNaN(location.speed * 3.6) ? 0 : (location.speed * 3.6);
              // this.dbRef.child("locations").push({ lat: location.latitude, lng: location.longitude });
            }
            this.taskKey = this.backgroundGeolocation.startTask().then(() => {
              if (location) {
                this.lat = location.latitude;
                this.long = location.longitude;
                this.speed = this.speed = Number.isNaN(location.speed * 3.6) ? 0 : (location.speed * 3.6);
                // this.dbRef.child("locations").push({ lat: location.latitude, lng: location.longitude });
              }
            }).catch(err => {
              console.log(err);
            })
          }, err => {
            console.log(err)
          });
        }).catch(err => {
          console.log(err);
        });
    }, 5000)

    // start recording location
    this.backgroundGeolocation.start();
  }


}
