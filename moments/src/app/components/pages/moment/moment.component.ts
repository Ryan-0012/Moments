import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MomentService } from 'src/app/services/moment.service';
import { Moment } from 'src/app/Moment';
import { environment } from 'environments/environment';
import { faTimes, faEdit } from '@fortawesome/free-solid-svg-icons'; 
import { MessagesService } from 'src/app/services/messages.service';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { CommentService } from 'src/app/services/comment.service';
import { Comment } from 'src/app/Comment';



@Component({
  selector: 'app-moment',
  templateUrl: './moment.component.html',
  styleUrls: ['./moment.component.css']
})
export class MomentComponent implements OnInit{
  moment?: Moment ;
  baseApiUrl = environment.baseApiurl; 

  faTimes = faTimes;
  faEdit = faEdit;

  commentForm!: FormGroup;




  constructor(private momentService: MomentService,
     private route: ActivatedRoute,
     private messagesService: MessagesService,
     private router: Router,
     private commentService: CommentService){}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.momentService.getMoment(id).subscribe((item) => (this.moment = item.data));

    this.commentForm = new FormGroup({
      text: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
    });
  }

  get text(){
    return this.commentForm.get('text')!;
  }

  get name(){
    return this.commentForm.get('name')!;
  }

  async removeHandler(id: number){
    await (await this.momentService.removeMoment(id)).subscribe();
    this.messagesService.add("Momento excluido com sucesso!");
    
    this.router.navigate(['/']);
  }

  async onSubmit(formDirective: FormGroupDirective){
    if(this.commentForm.invalid){
      return 
    }
    const data: Comment = this.commentForm.value;
    data.moment_id= Number(this.moment!.id)

    await this.commentService.createComment(data).subscribe((comment) => this.moment!.comments!.push(comment.data));

    this.messagesService.add("Comentário adicionado!")

    this.commentForm.reset();

    formDirective.resetForm();
  }
}
