import { Component, OnInit, Input } from '@angular/core';
import { DeploymentI } from '../../state/deployment.i';

@Component({
  selector: 'app-deployment-step',
  templateUrl: './deployment-step.component.html',
  styleUrls: ['./deployment-step.component.scss'],
})
export class DeploymentStepComponent implements OnInit {

  @Input() step: DeploymentI;

  constructor() { }

  ngOnInit() {}

}
