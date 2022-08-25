import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

import { Hospital } from 'src/app/models/hospital.model';
import { HospitalsService } from 'src/app/services/hospitals.service';
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
  selector: 'app-hospitals',
  templateUrl: './hospitals.component.html',
  styles: [
  ]
})
export class HospitalsComponent implements OnInit, AfterViewInit, OnDestroy {

  public hospitals: Hospital[] = [];
  public hospitalsTemp: Hospital[] = [];
  public loading: boolean = true;

  @ViewChild('txtSearch') txtSearch!: ElementRef;
  public imgSubs: Subscription = new Subscription;

  constructor(
    private hospitalsService: HospitalsService,
    private modalImgService: ModalImgService,
    private searchService: SearchService
  ) { }
  
  ngAfterViewInit(): void {
    this.imgSubs = this.modalImgService.newImage.subscribe(img => {
      if (this.txtSearch.nativeElement.value) {
        this.txtSearch.nativeElement.value = '';
      }
      this.getHospitals();
    });
  }
  ngOnInit(): void {
    this.getHospitals();
  }
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  getHospitals() {
    this.loading = true;
    this.hospitalsService.getAll().subscribe({
      next: hospitals => {
        this.hospitals = hospitals;
        this.hospitalsTemp = this.hospitals;
        this.loading = false;
      },
    });
  }

  async createHospital() {
    await Swal.fire<string>({
      title: 'Crear hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del hospital',
      showCancelButton: true
    }).then((result) => {
      if (result.value && result.value.trim().length > 0) {
        this.hospitalsService.create(result.value).subscribe({
          next: (resp: any) => {
            Toast.fire({ icon: 'success', text: `Hospital "${resp.hospital.name}" creado.` });
            this.hospitals.push(resp.hospital);
          }
        })
      } else {
        Toast.fire({
          text: 'Hospital no creado',
          icon: 'error'
        });
      }
    })

    
  }

  updateHospital(hospital: Hospital) {
    this.hospitalsService.update(hospital._id!, hospital.name).subscribe({
      next: (resp: any) => {
        Toast.fire({ icon: 'success', text: `Hospital "${resp.hospital.name}" actualizado.` });
        this.getHospitals();
      },
      error: (err) => {
        Toast.fire({ icon: 'error', text: err.error.msg, title: 'Error' });
      }
    })
  }

  deleteHospital(hospital: Hospital) {
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
        this.hospitalsService.delete(hospital._id!).subscribe({
          next: (resp: any) => {
            Toast.fire({ icon: 'success', text: `Hospital "${resp.hospital.name}" borrado.` });
            this.getHospitals();
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
          text: `El hospital "${hospital.name}" no ha sido borrado.`,
          icon: 'error'
        })
      }
    });
  }

  openModal(hospital: Hospital) {
    this.modalImgService.openModal('hospitals', hospital._id, hospital.img);
  }

  searchHospitals(term: string) {
    if (term.length === 0) {
      this.hospitals = this.hospitalsTemp;
      return;
    }
    this.searchService.search('hospitals', term).subscribe({
      next: (resp: any) => {
        this.hospitals = resp;
      }
    })
  }

}
