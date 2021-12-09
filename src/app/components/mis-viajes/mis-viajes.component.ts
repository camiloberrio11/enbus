import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data/data.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Viaje } from 'src/app/models/viaje.dto';
import { repeat } from 'rxjs/operators';

@Component({
  selector: 'app-mis-viajes',
  templateUrl: './mis-viajes.component.html',
  styleUrls: ['./mis-viajes.component.css']
})
export class MisViajesComponent implements OnInit {

  viajes: Viaje[] = [];

  formBusqueda = new FormGroup({
    documento: new FormControl('', Validators.required),
    orden: new FormControl('', Validators.required),
  });

  constructor(
    private dataservice: DataService,
  ) { }

  ngOnInit() {}

  onSubmit() {
    this.dataservice.getViajes(
      this.formBusqueda.value.documento,
      this.formBusqueda.value.orden,
    ).subscribe(
      data => {
        let resp;
        resp = data;

        this.viajes = [];

        resp.forEach(viaje => {
          this.viajes.push(viaje);
        });
      },
      err => {
        console.log(err);
      },
    );
  }
}
