import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

import { User } from '../../models/user.model';
import { Hospital } from '../../models/hospital.model';
import { Doctor } from '../../models/doctor.model';

import { SearchService } from '../../services/search.service';
import { UserService } from '../../services/user.service';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styles: [
  ]
})
export class SearchComponent implements OnInit {

  public users: User[] = [];
  public hospitals: Hospital[] = [];
  public doctors: Doctor[] = [];

  constructor(private activatedRoute: ActivatedRoute, private searchService: SearchService, public userService: UserService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe({
      next: ({ term }) => this.searchTerm(term)
    })
  }

  searchTerm(term: string) {
    this.searchService.searchAll(term).subscribe({
      next: (resp: any) => {
        this.users = resp.users;
        this.hospitals = resp.hospitals;
        this.doctors = resp.doctors;
      },
      error: err => {
        Toast.fire({ icon: 'error', title: 'Error', text: err.error.msg });
      }
    });
  }
}
