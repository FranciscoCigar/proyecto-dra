import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Tienda } from '../modelo/tienda.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Bolsa } from '../modelo/bolsa.model';

@Injectable()
export class TiendaServicio{
  tiendaColeccion: AngularFirestoreCollection<Tienda>;
  tiendaDoc: AngularFirestoreDocument<Tienda>;
  tiendas: Observable<Tienda[]>;
  tienda: Observable<Tienda>;

  constructor(private db: AngularFirestore){
    console.log('db', db);
    this.tiendaColeccion = db.collection('tienda', ref => ref.orderBy('nombre', 'asc'));
  }

  getObjetos(): Observable<Tienda[]>{
    this.tiendas = this.tiendaColeccion.snapshotChanges().pipe(
      map( cambios => {
        console.log('cambios', cambios);
        return cambios.map( accion => {
          const datos = accion.payload.doc.data() as Tienda;
          datos.id = accion.payload.doc.id;
          console.log('datos', datos);
          return datos;
        });
      })
    );
    return this.tiendas;
  }

  comprar(bolsa: Bolsa, tienda: Tienda){
    // this.tiendaDoc = this.db.doc(`bolsa/${bolsa.id}`);
    // this.tiendaDoc.update( { array: firebase.firestore.bolsa.arrayUnion(tienda.objeto) });
  }

}
