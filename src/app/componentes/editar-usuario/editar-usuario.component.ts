import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/modelo/usuario.model';
import { UsuarioServicio } from 'src/app/servicios/usuario.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.css']
})
export class EditarUsuarioComponent implements OnInit {

  usuario: Usuario = {
    nombre: '',
    apellido: '',
    email: '',
    monedas: 0
  };

  id: string;

  constructor(private usuariosServicio: UsuarioServicio,
              private flashMessages: FlashMessagesService,
              private router: Router,
              private route: ActivatedRoute
) { }

  ngOnInit() {
    // tslint:disable-next-line: no-string-literal
    this.id = this.route.snapshot.params['id'];
    this.usuariosServicio.getUsuario(this.id).subscribe( usuario => {
      this.usuario = usuario;
    });
  }

  guardar({value, valid}: {value: Usuario, valid: boolean}){
    if (!valid){
      this.flashMessages.show('Por favor llena el formulario correctamente', {
        cssClass: 'alert-danger', timeout: 4000
      });
    }
    else{
      value.id = this.id;
      this.usuariosServicio.modificarUsuario(value);
      this.router.navigate(['/']);
    }
  }

  eliminar(){
    if (confirm('¿Seguro que desea elminiar el usuario?')){
      this.usuariosServicio.eliminarUsuario(this.usuario);
      this.router.navigate(['/']);
    }
  }

}
