import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { RMResponse } from './models/models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private api = 'https://rickandmortyapi.com/api/';

  constructor( private http: HttpClient ) {  }

  getCharacters(page?: number): Observable<RMResponse> {
    const apiLink = this.api + 'character/?page=' + page ?? 1;
    return <Observable<RMResponse>>this.http.get(apiLink);
  }

  getEpisodes(page?: number): Observable<any> {
    const apiLink = this.api + 'episode/?page=' + page ?? 1;
    return <Observable<RMResponse>>this.http.get(apiLink);
  }
}
