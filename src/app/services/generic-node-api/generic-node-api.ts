import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class GenericNodeApiService {

  baseApiUrl: string = 'http://localhost:3000/api/'

  constructor(private http: Http) { }

  getRequest(apiRouteUrl): Observable<Object[]> {
    return this.http.get(this.baseApiUrl + apiRouteUrl)
                    .map(this.extractData)
                    .catch(this.handleError)
  }

  private extractData(res: Response) {
    try{
      let body = res.json();
      return body.result || { };
    } catch (e) {
      console.error('Error extracting api data: ' + e )
    }
  }

  private handleError (error: Response | any) {
    console.log(error)
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return Observable.throw(errMsg);
  }
}
