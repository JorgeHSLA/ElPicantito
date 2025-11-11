import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

export const precioMappingInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    map(event => {
      if (event instanceof HttpResponse) {
        // Mapear la respuesta para incluir precio
        const body = event.body;
        if (body) {
          if (Array.isArray(body)) {
            // Si es un array, mapear cada elemento
            const mappedBody = body.map(item => addPrecioCompatibility(item));
            return event.clone({ body: mappedBody });
          } else {
            // Si es un objeto único, mapearlo
            const mappedBody = addPrecioCompatibility(body);
            return event.clone({ body: mappedBody });
          }
        }
      }
      return event;
    })
  );
};

function addPrecioCompatibility(item: any): any {
  if (item && typeof item === 'object') {
    // Si tiene precioDeVenta pero no precio, agregar precio
    if (item.precioDeVenta !== undefined && item.precio === undefined) {
      return { ...item, precio: item.precioDeVenta };
    }
  }
  return item;
}