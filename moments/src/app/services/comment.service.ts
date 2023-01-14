import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http';
import { Response } from '../Response'; 
import { environment } from 'environments/environment';
import { Moment } from '../Moment';
import { Comment } from '../Comment';



@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private baseApiurl = environment.baseApiurl
  private apiurl = `${this.baseApiurl}api/moments`

  constructor(private http: HttpClient) { }

  createComment(data: Comment): Observable<Response<Comment>> {
 
    const url = `${this.apiurl}/${data.moment_id}/comments`
    
    return this.http.post<Response<Comment>>(this.apiurl, data);
  }
  
  
  
}
