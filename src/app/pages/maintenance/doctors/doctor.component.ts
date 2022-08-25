import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

import { Hospital } from 'src/app/models/hospital.model';
import { Doctor } from '../../../models/doctor.model';
import { HospitalsService } from 'src/app/services/hospitals.service';
import { DoctorsService } from '../../../services/doctors.service';

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
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styles: [
  ]
})
export class DoctorComponent implements OnInit {

  public doctorForm!: FormGroup;
  public hospitals: Hospital[] = [];

  public selectedDoctor!: Doctor;
  public selectedHospital!: Hospital;

  constructor(
    private fb: FormBuilder,
    private hospitalsService: HospitalsService,
    private doctorsService: DoctorsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.doctorForm = this.fb.group({
      name: ['', Validators.required],
      hospital: ['', Validators.required]
    })
    this.getHospitals();
    this.doctorForm.get('hospital')?.valueChanges.subscribe({
      next: hospitalId => {
        this.selectedHospital = this.hospitals.find(h => h._id === hospitalId)!;
      }
    });
    this.activatedRoute.params.subscribe(({ id }) => id === 'crear' ? this.selectedDoctor : this.getDoctor(id));
  }

  private getDoctor(id: string) {
    this.doctorsService.getById(id)
      .subscribe({
        next: (resp: any) => {
          this.selectedDoctor = resp.doctor;
          const { name, hospital: { _id } } = resp.doctor;
          this.doctorForm.setValue({ name, hospital: _id });
          this.selectedHospital = this.hospitals.find(h => h._id === _id)!;
        },
        error: (e) => {
          Toast.fire({ icon: 'error', text: e.error.msg, title: 'Error' });
          this.router.navigateByUrl('/dashboard/medicos');
        }
      });
  }

  getHospitals() {
    this.hospitalsService.getAll().subscribe({
      next: (resp) => {
        this.hospitals = resp;
      }
    });
  }

  save() {
    if (this.selectedDoctor) {
      const updatedDoctor = new Doctor(this.doctorForm.value.name, this.selectedDoctor._id, this.selectedDoctor.img,
        this.doctorForm.value.hospital, undefined);
      this.doctorsService.update(updatedDoctor).subscribe({
        next: (resp: any) => {
          Toast.fire({ icon: 'success', text: `Modificado doctor ${resp.doctor.name}` });
          this.router.navigateByUrl('/dashboard/medicos');
        },
        error: (err) => {
          console.log(err);
        }
      });
    } else {
      const createdDoctor = new Doctor(this.doctorForm.value.name, undefined, undefined, this.doctorForm.value.hospital, undefined)
      this.doctorsService.create(createdDoctor).subscribe({
        next: (resp: any) => {
          Toast.fire({ icon: 'success', text: `Creado doctor ${resp.newDoctor.name}` });
          this.router.navigateByUrl('/dashboard/medicos');
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
  }

}
