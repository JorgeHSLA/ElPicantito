import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class PrecioMappingInterceptor implements HttpInterceptor {
  
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      map(event => {
        if (event instanceof HttpResponse) {
          // Mapear la respuesta para incluir precio
          const body = event.body;
          if (body) {
            if (Array.isArray(body)) {
              // Si es un array, mapear cada elemento
              const mappedBody = body.map(item => this.addPrecioCompatibility(item));
              return event.clone({ body: mappedBody });
            } else {
              // Si es un objeto único, mapearlo
              const mappedBody = this.addPrecioCompatibility(body);
              return event.clone({ body: mappedBody });
            }
          }
        }
        return event;
      })
    );
  }

  private addPrecioCompatibility(item: any): any {
    if (item && typeof item === 'object') {
      // Si tiene precioDeVenta pero no precio, agregar precio
      if (item.precioDeVenta !== undefined && item.precio === undefined) {
        return { ...item, precio: item.precioDeVenta };
      }
    }
    return item;
  }
}