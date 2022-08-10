import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-progress-increment',
  templateUrl: './progress-increment.component.html',
  styles: [
  ]
})
export class ProgressIncrementComponent implements OnInit{

  ngOnInit() {
    this.btnClass = `btn ${this.btnClass}`;
  }

  @Input() progressValue: number = 40;
  @Input() btnClass: string = 'btn-primary';

  @Output() changeOutputValue: EventEmitter<number> = new EventEmitter();

  changePercValue(value: number) {

    if (this.progressValue >= 100 && value >= 0) {
      this.changeOutputValue.emit(100);
      return this.progressValue = 100;
    }
    if (this.progressValue <= 0 && value < 0) {
      this.changeOutputValue.emit(0);
      return this.progressValue = 0;
    }

    this.progressValue = this.progressValue + value
    this.changeOutputValue.emit(this.progressValue);
    return this.progressValue;
  }

  onChange(newValue: number) {

    if (newValue >= 100) {
      this.progressValue = 100;
    } else if (newValue <= 0) {
      this.progressValue = 0;
    } else {
      this.progressValue = newValue;
    }

    this.changeOutputValue.emit(this.progressValue);
  }

}
