import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Usuario } from '../modelo/usuario.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Bolsa } from '../modelo/bolsa.model';
import { BolsaServicio } from './bolsa.service';

@Injectable()
export class UsuarioServicio{
  usuariosColeccion: AngularFirestoreCollection<Usuario>;
  usuarioDoc: AngularFirestoreDocument<Usuario>;
  usuarios: Observable<Usuario[]>;
  usuario: Observable<Usuario>;
  bolsaColeccion: AngularFirestoreCollection<Bolsa>;
  bolsas: Observable<Bolsa[]>;
  bolsa: Observable<Bolsa>;
  bolsaDoc: AngularFirestoreDocument<Bolsa>;

  constructor(
    private db: AngularFirestore,
    private bolsaServicio: BolsaServicio){
    console.log('db', db);
    this.usuariosColeccion = db.collection('usuarios', ref => ref.orderBy('nombre', 'asc'));
    this.bolsaColeccion = db.collection('bolsa');
    this.bolsaServicio = bolsaServicio;
  }

  getUsuarios(): Observable<Usuario[]>{
    this.usuarios = this.usuariosColeccion.snapshotChanges().pipe(
      map( cambios => {
        console.log('cambios', cambios);
        return cambios.map( accion => {
          const datos = accion.payload.doc.data() as Usuario;
          datos.id = accion.payload.doc.id;
          console.log('datos', datos);
          return datos;
        });
      })
    );
    console.log('this.usuarios', this.usuarios);
    return this.usuarios;
  }

  agregarUsuario(usuario: Usuario){
    this.usuariosColeccion.add(usuario).then((docRef) =>
      this.bolsaColeccion.add({objetos: ['pocion'] , pertenece: docRef.id})
      )
    .catch(function(error) {
        console.error("Error al añadir el usuario: ", error);
    });
  }

  getUsuario(id: string){
    this.usuarioDoc = this.db.doc<Usuario>(`usuarios/${id}`);
    this.usuario = this.usuarioDoc.snapshotChanges().pipe(
        map( accion => {
            if (accion.payload.exists === false){
                return null;
            }
            else{
                const datos = accion.payload.data() as Usuario;
                datos.id = accion.payload.id;
                return datos;
            }
        })
    );
    return this.usuario;
}

modificarUsuario(usuario: Usuario){
    this.usuarioDoc = this.db.doc(`usuarios/${usuario.id}`);
    this.usuarioDoc.update(usuario);
}

eliminarUsuario(usuario: Usuario){
    this.usuarioDoc = this.db.doc(`usuarios/${usuario.id}`);
    this.usuarioDoc.delete();

    // this.bolsaDoc = this.db.doc<Bolsa>(`bolsas`);
    // this.bolsa = this.bolsaDoc.snapshotChanges().pipe(
    //     map( accion => {
    //         if (accion.payload.exists === false){
    //             return null;
    //         }
    //         else{
    //             const datos = accion.payload.data() as Bolsa;
    //             datos.id = accion.payload.id;
    //             return datos;
    //         }
    //     })
    // );
    // return this.bolsa;

}

}
