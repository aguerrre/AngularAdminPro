import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';
import { filter, map, Subscription } from 'rxjs';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ]
})
export class BreadcrumbsComponent implements OnDestroy{

  public title!: string;
  public titleSub$: Subscription | undefined;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.titleSub$ = this.getRouteData().subscribe({
      next: ({ title }) => {
        this.title = title;
        document.title = `Admin Pro - ${title}`;
      },
    });
  }
  ngOnDestroy(): void {
    this.titleSub$?.unsubscribe();
  }

  getRouteData() {
    return this.router.events.pipe(
      filter((event: any) => event instanceof ActivationEnd),
      filter((event: ActivationEnd) => event.snapshot.firstChild === null),
      map((event: ActivationEnd) => event.snapshot.data),
    );
  }

}
