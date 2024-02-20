import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

// import { createRequestOption } from 'app/shared';
// import { IPortalAccess } from 'app/shared/model/portal-access.model';

// type EntityResponseType = HttpResponse<IPortalAccess>;
// type EntityArrayResponseType = HttpResponse<IPortalAccess[]>;

@Injectable({ providedIn: 'root' })
export class CommonHttpService {
  public resourceUrl = 'http://35.153.98.201:3000/api';
  header : any;
  constructor(protected http: HttpClient) {}

  create(item: any, url?:string): Observable<HttpResponse<any>> {
    return this.http.post<any>(`${this.resourceUrl}/${url}`, item, { observe: 'response' });
  }

  update(item: any, url?:string): Observable<HttpResponse<any>> {
    return this.http.put<any>(`${this.resourceUrl}/${url}`, item, { observe: 'response' });
  }

  get(url): Observable<HttpResponse<any>> {   
    return this.http.get<any>(`${this.resourceUrl}/${url}`,{ observe: 'response' });
  }

  // getAll(req?: any): Observable<EntityArrayResponseType> {
  //   const options = createRequestOption(req);
  //   return this.http.get<IPortalAccess[]>(this.resourceUrl, { params: options, observe: 'response' });
  // }

  delete(url?:string): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${url}`, { observe: 'response' });
  }
}