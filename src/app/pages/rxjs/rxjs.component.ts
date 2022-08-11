import { Component, OnDestroy } from '@angular/core';
import { filter, interval, map, Observable, Subscription, take } from 'rxjs';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnDestroy{

  public intervalSubs: Subscription | undefined;

  constructor() {

    /* this.returnObs().subscribe({
      next: (value: number) => console.log('subs: ' + value),
      error: (err: string) => console.log(err),
      complete: () => console.info('Obs terminado')
    }); */
    this.intervalSubs = this.returnInterval().subscribe({
      next: console.log,
      complete() { console.log('Complete') }
    });

  }

  ngOnDestroy(): void {
    this.intervalSubs?.unsubscribe();
  }

  returnInterval(): Observable<string> {
    return interval(100).pipe(
      //take(10),
      filter(value => ((value + 1) % 2 === 0) ? true : false),
      map(value => { return 'Hola mundo ' + (value + 1) }),
    );
  }

  returnObs(): Observable<number> {
    let i = 0;

    return new Observable<number>(observer => {
      const interval = setInterval(() => {
        i++;
        observer.next(i);
        if (i === 5) {
          clearInterval(interval);
          observer.complete();
        }
        if (i === 2) {
          observer.error('i llego al 2');
        }
      }, 1000)
    });

  }

}

/* (err) => console.warn(err),
  () => console.info('Obs terminado.') 
  value => console.log('subs: ' + value)*/
