import { Injectable } from '@angular/core';

import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private faio: FingerprintAIO) { }

  biometricAuthentication() {
    return from(this.faio.show({
      title: 'CapRover Biometric Authentication',
      description: 'Authenticate to Use stored tokens',
    }))
  }
}
