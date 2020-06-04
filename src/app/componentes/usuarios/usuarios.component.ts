import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UsuarioServicio } from 'src/app/servicios/usuario.service';
import { Usuario } from 'src/app/modelo/usuario.model';
import { FlashMessagesService } from 'angular2-flash-messages';
import { NgForm } from '@angular/forms';
import { Bolsa } from 'src/app/modelo/bolsa.model';
import { BolsaServicio } from 'src/app/servicios//bolsa.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[];
  usuario: Usuario = {
    nombre: '',
    apellido: '',
    raza: '',
    email: '',
    monedas: 0
  };

  @ViewChild('usuarioForm') usuarioForm: NgForm;
  @ViewChild('botonCerrar') botonCerrar: ElementRef;


  constructor(private usuariosServicio: UsuarioServicio,
              private flashMessages: FlashMessagesService,
              private bolsaServicio: BolsaServicio
    ) { }

  ngOnInit(): void {
    this.usuariosServicio.getUsuarios().subscribe(
      usuarios => {
        this.usuarios = usuarios;
        console.log('this.usuarios', this.usuarios);
      }
    );
  }

  getMonedasTotal(){
    // tslint:disable-next-line: no-inferrable-types
    let monedasTotal: number = 0;
    if ( this.usuarios ){
      this.usuarios.forEach( usuario => {
        monedasTotal += usuario.monedas;
      });
    }
    return monedasTotal;
  }

  agregar({value, valid}: {value: Usuario, valid: boolean}){
    if (!valid){
      this.flashMessages.show('Por favor llena el formulario correctamente', {
        cssClass: 'alert-danger', timeout: 4000
      });
    }
    else{
      this.usuariosServicio.agregarUsuario(value)
      this.usuarioForm.resetForm();
      this.cerrarModal();
    }
  }

  private cerrarModal(){
    this.botonCerrar.nativeElement.click();
  }
}
