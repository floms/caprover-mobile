import { TestBed } from '@angular/core/testing';

import { DeploymentGuard } from './deployment.guard';

describe('DeploymentGuard', () => {
  let guard: DeploymentGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(DeploymentGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
