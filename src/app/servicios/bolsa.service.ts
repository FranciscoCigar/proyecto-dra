import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Bolsa } from '../modelo/bolsa.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usuario } from '../modelo/usuario.model';

@Injectable()
export class BolsaServicio{
  bolsasColeccion: AngularFirestoreCollection<Bolsa>;
  bolsaDoc: AngularFirestoreDocument<Bolsa>;
  bolsas: Observable<Bolsa[]>;
  bolsa: Observable<Bolsa>;

  constructor(private db: AngularFirestore
    ){
    this.bolsasColeccion = db.collection('bolsa');
  }

  getBolsas(): Observable<Bolsa[]>{
    this.bolsas = this.bolsasColeccion.snapshotChanges().pipe(
      map( cambios => {
        console.log('cambios', cambios);
        return cambios.map( accion => {
          const datos = accion.payload.doc.data() as Bolsa;
          datos.id = accion.payload.doc.id;
          return datos;
        });
      })
    );
    return this.bolsas;
  }

  agregarBolsa(id){
    // private bolsacrear: Bolsa = {objetos: {}, pertenece: ''}
    this.bolsasColeccion.add({objetos: {}, pertenece: id});
  }

  getBolsa(id: string){
    this.bolsaDoc = this.db.doc<Bolsa>(`bolsa/${id}`);
    this.bolsa = this.bolsaDoc.snapshotChanges().pipe(
        map( accion => {
            if (accion.payload.exists === false){
                return null;
            }
            else{
                const datos = accion.payload.data() as Bolsa;
                datos.id = accion.payload.id;
                return datos;
            }
        })
    );
    return this.bolsa;
}

modificarBolsa(bolsa: Bolsa){
    this.bolsaDoc = this.db.doc(`bolsa/${bolsa.id}`);
    this.bolsaDoc.update(bolsa);
}
}
