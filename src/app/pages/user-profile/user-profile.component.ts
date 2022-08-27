import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { FileUploadService } from '../../services/file-upload.service';

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
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styles: []
})
export class UserProfileComponent implements OnInit {

  public user: User;

  public profileForm!: FormGroup;
  public formSubmitted: boolean = false;

  public imageToUpload!: File;
  public imageTemp: any = '';

  constructor(private fb: FormBuilder, private userService: UserService, private fileUploadService: FileUploadService) {
    this.user = userService.user;
  }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      first_name: [this.user.first_name, Validators.required],
      email: [this.user.email, [Validators.email, Validators.required]]
    });
  }

  notValidField(field: string): boolean {
    return this.profileForm.get(field)?.invalid && this.formSubmitted ? true : false;
  }

  updateProfile() {
    this.formSubmitted = true;

    this.userService.update(this.profileForm.value).subscribe({
      next: (resp: any) => {
        // Actualiza en tiempo real el nombre en la web. debe usarse así por el siguiente motivo:
        /* Esto se conoce como "dot. rule" en angularJS para enlazar correctamente una referencia.
        Resumen: Cuando quieras que todas las referencias a una propiedad de servicio cambie, 
        tienes que actualizar alguna de sus propiedades y no el objeto directamente. */
        this.user.first_name = resp.user.first_name;
        this.user.email = resp.user.email;
        Toast.fire({ icon: 'success', text: 'Usuario actualizado' });
      },
      error: (err) => {
        if (err.error.msg) {
          Toast.fire({ icon: 'error', text: err.error.msg, title: 'Error' });
        } else {
          Toast.fire({ icon: 'error', text: 'No se ha podido actualizar el usuario.', title: 'Error' });
        }
      }
    })
  }

  changeImage(event: any) {
    const file: File = event.target.files[0];
    // Si cancelas la subida de imagen, muestra la que existe en bbdd.
    if (!file) { this.imageTemp = ''; return; }
    this.imageToUpload = file;
    // Mostrar la foto que se selecciona en tiempo real.
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      this.imageTemp = reader.result;
    }
  }

  uploadimage() {

    if (!this.imageToUpload) {
      Toast.fire({ icon: 'error', text: 'No se ha podido actualizar la imagen.', title: 'Error' });
      return;
    }

    this.fileUploadService.update(this.imageToUpload, 'users', this.user.uid!)
      .then(img => {
        this.user.img = img
        Toast.fire({ icon: 'success', text: 'Imagen actualizada con éxito.' });
      })
      .catch(err => {
        Toast.fire({ icon: 'error', text: 'No se ha podido actualizar la imagen.', title: 'Error' });
      });

  }

}
