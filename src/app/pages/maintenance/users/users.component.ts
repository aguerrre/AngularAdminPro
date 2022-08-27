import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import Swal from 'sweetalert2';

import { User } from 'src/app/models/user.model';

import { ModalImgService } from 'src/app/services/modal-img.service';
import { SearchService } from 'src/app/services/search.service';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success mx-1',
    cancelButton: 'btn btn-danger mx-1'
  },
  buttonsStyling: false
})
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
  selector: 'app-users',
  templateUrl: './users.component.html',
  styles: [
  ]
})
export class UsersComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('txtSearch') txtSearch!: ElementRef;
  public totalUsers: number = 0;
  public totalPages: number = 0;
  public totalPagesTemp: number = 0;
  public users: User[] = [];
  public usersTemp: User[] = [];
  public actualPage: number = 1;
  public actualPageTemp: number = 1;

  public imgSubs: Subscription = new Subscription;
  public loading: boolean = true;

  constructor(
    private userService: UserService,
    private searchService: SearchService,
    private modalimgService: ModalImgService
  ) { }
  
  ngAfterViewInit(): void {
    this.imgSubs = this.modalimgService.newImage.subscribe(img => {
      this.actualPage = 1;
      this.actualPageTemp = this.actualPage;
      if (this.txtSearch.nativeElement.value) {
        this.txtSearch.nativeElement.value = '';
      }
      this.getUsersPaginated();
    });
  }
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }
  ngOnInit() {
    this.getUsersPaginated();
  }

  getUsersPaginated() {
    this.loading = true;
    this.userService.getAllPaginated(this.actualPage).subscribe({
      next: ({ total, totalPages, users }) => {
        this.totalUsers = total;
        this.totalPages = totalPages;
        this.totalPagesTemp = totalPages;
        this.users = users;
        this.usersTemp = users;
        this.loading = false;
      },
    });
  }

  changePage(numPage: number) {
    this.actualPage += numPage;

    if (this.actualPage < 1) {
      this.actualPage = 1;
    } else if (this.actualPage > this.totalPages) {
      this.actualPage = this.totalPages;
    }

    this.actualPageTemp = this.actualPage;
    this.getUsersPaginated();
  }

  searchUsers(term: string) {
    if (term.length === 0) {
      this.users = this.usersTemp;
      this.actualPage = this.actualPageTemp;
      this.totalPages = this.totalPagesTemp;
      return;
    }
    this.searchService.search('users', term).subscribe({
      next: (resp:any) => {
        this.users = resp;
        this.actualPage = 1;
        this.totalPages = 1;
      }
    });
  }

  deleteUser(user: User) {
    if (user.uid === this.userService.uid) {
      Toast.fire({
        text: `¡No puedes borrarte a tí mismo!`,
        icon: 'error'
      })
      return;
    }
    swalWithBootstrapButtons.fire({
      title: '¿Seguro que desea eliminar?',
      text: "Esta acción será irreversible.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, ¡seguro!',
      cancelButtonText: 'No, ¡cancela!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.delete(user).subscribe({
          next: (resp: any) => {
            Toast.fire({
              text: `El usuario ${resp.user.first_name} ha sido borrado.`,
              icon: 'success'
            })
            this.totalUsers--;
            this.totalPages = this.totalUsers % 10 !== 0 ? this.totalPages : this.totalPages - 1;
            this.totalPagesTemp = this.totalPages;
            this.actualPage = this.actualPage > this.totalPages ? this.totalPages : this.actualPage;
            if (this.txtSearch.nativeElement.value) {
              this.actualPage = 1;
              this.txtSearch.nativeElement.value = '';
            }
            this.actualPageTemp = this.actualPage;
            this.getUsersPaginated();
          },
          error: (err) => {
            Toast.fire({
              title: 'Error',
              text: err.error.msg,
              icon: 'error'
            })
          }
        })

      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Toast.fire({
          text: `El usuario ${user.first_name} no ha sido borrado.`,
          icon: 'error'
        })
      }
    })
  }

  updateRole(user: User) {
    if (user.role !== 'ADMIN_ROLE' && user.role !== 'USER_ROLE') {
      Toast.fire({
        title: 'Error',
        text: 'El rol no está disponible.',
        icon: 'error'
      })
      return;
    }
    this.userService.save(user).subscribe({
      next: () => { },
      error: (err) => {
        Toast.fire({
          title: 'Error',
          text: err.error.msg,
          icon: 'error'
        })
      }
    })
  }

  openModal(user: User) {
    this.modalimgService.openModal('users', user.uid, user.img);
  }

}
