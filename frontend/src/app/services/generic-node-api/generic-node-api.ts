import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

import { Observable } from 'rxjs/Rx'
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/map'

import { nodeApiBaseUrl } from "../config"


@Injectable()
export class GenericNodeApiService {

  baseApiUrl: string = nodeApiBaseUrl

  constructor(private http: HttpClient) { }

  getRequest(apiRouteUrl): Observable<any> {
    return this.http.get(this.baseApiUrl + apiRouteUrl)
                    .map(this.extractData)
                    .catch(this.handleError)
  }

  private extractData(res: Response) {
    try{
      return res
    } catch (error) {
      console.error('Error extracting api data: ' + error )
      return ['Error']
    }
  }

  private handleError (error: Response | any) {
    let errMsg: string
    if (error instanceof Response) {
      const err = error || JSON.stringify(error)
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`
    } else {
      errMsg = error.message ? error.message : error.toString()
    }
    return Observable.throw(errMsg)
  }
}
