import { TestBed } from '@angular/core/testing';

import { AppDeployService } from './app-deploy.service';

describe('AppDeployService', () => {
  let service: AppDeployService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppDeployService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
