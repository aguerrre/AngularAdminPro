import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalImgService } from 'src/app/services/modal-img.service';

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
  selector: 'app-modal-img',
  templateUrl: './modal-img.component.html',
  styleUrls: ['./modal-img.component.css']
})
export class ModalImgComponent implements OnInit {

  public imageToUpload!: File;
  public imageTemp: any = '';

  constructor(public modalImgService: ModalImgService, private fileUploadService: FileUploadService) { }

  ngOnInit(): void { }

  closeModal() {
    this.imageTemp = null;
    this.modalImgService.closeModal();
  }

  changeImage(event: any) {
    const file: File = event.target.files[0];
    // Si cancelas la subida de imagen, muestra la que existe en bbdd.
    if (!file) { this.imageTemp = null; return; }
    this.imageToUpload = file;
    // Mostrar la foto que se selecciona en tiempo real.
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      this.imageTemp = reader.result;
    }
  }

  uploadImage() {

    if (!this.imageToUpload) {
      Toast.fire({ icon: 'error', text: 'No se ha podido actualizar la imagen.', title: 'Error' });
      return;
    }

    const id: any = this.modalImgService.id;
    const collection = this.modalImgService.collection

    this.fileUploadService.update(this.imageToUpload, collection, id)
      .then(img => {
        Toast.fire({ icon: 'success', text: 'Imagen actualizada con éxito.' });
        this.modalImgService.newImage.emit(img);
        this.closeModal();
      })
      .catch(err => {
        Toast.fire({ icon: 'error', text: 'No se ha podido actualizar la imagen.', title: 'Error' });
      });

  }

}
