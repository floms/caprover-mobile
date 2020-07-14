import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ClusterPage } from './cluster.page';

describe('ClusterPage', () => {
  let component: ClusterPage;
  let fixture: ComponentFixture<ClusterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClusterPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ClusterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
