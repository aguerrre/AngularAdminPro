import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { Doctor } from 'src/app/models/doctor.model';
import { DoctorsService } from 'src/app/services/doctors.service';
import { ModalImgService } from 'src/app/services/modal-img.service';
import { SearchService } from 'src/app/services/search.service';

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
const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success mx-1',
    cancelButton: 'btn btn-danger mx-1'
  },
  buttonsStyling: false
})

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
})
export class DoctorsComponent implements OnInit, OnDestroy, AfterViewInit {

  public doctors: Doctor[] = [];
  private doctorsTemp: Doctor[] = [];

  public loading: boolean = true;
  @ViewChild('txtSearch') txtSearch!: ElementRef;
  private imgSub: Subscription = new Subscription();

  constructor(
    private doctorsService: DoctorsService,
    private searchService: SearchService,
    private modalImgService: ModalImgService,
  ) { }

  ngOnInit(): void {
    this.getAllDoctors();
  }
  ngOnDestroy(): void {
    this.imgSub.unsubscribe();
  }
  ngAfterViewInit(): void {
    this.imgSub = this.modalImgService.newImage.subscribe(img => {
      if (this.txtSearch.nativeElement.value) {
        this.txtSearch.nativeElement.value = '';
      }
      this.getAllDoctors();
    });
  }


  getAllDoctors() {
    this.loading = true;
    this.doctorsService.getAll().subscribe({
      next: resp => {
        this.doctors = resp;
        this.doctorsTemp = this.doctors;
        this.loading = false;
      }
    })
  }

  deleteDoctor(doctor: Doctor) {
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
        this.doctorsService.delete(doctor).subscribe({
          next: (resp: any) => {
            Toast.fire({ icon: 'success', text: `Médico "${resp.doctor.name}" borrado.` });
            this.getAllDoctors();
          },
          error: (err) => {
            Toast.fire({
              title: 'Error',
              text: err.error.msg,
              icon: 'error'
            })
          }
        })

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Toast.fire({
          text: `El médico "${doctor.name}" no ha sido borrado.`,
          icon: 'error'
        })
      }
    });
  }

  openModal(doctor: Doctor) {
    this.modalImgService.openModal('doctors', doctor._id, doctor.img);
  }

  searchDoctor(term: string) {
    if (term.length === 0) {
      this.doctors = this.doctorsTemp;
      return;
    }
    this.searchService.search('doctors', term).subscribe({
      next: (resp: any) => {
        this.doctors = resp;
      }
    })
  }

}
