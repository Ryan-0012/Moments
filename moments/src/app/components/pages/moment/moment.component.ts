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
  moment?: Moment;
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

    this.momentService.getMoment(id).subscribe((item) => {
      if (item && item.data) {
        this.moment = item.data;
      } else {
        console.log("Não foi possível recuperar o momento com o ID fornecido.");
      }
    });
    
    this.commentForm = new FormGroup({
      text: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
    });

    
  }

  get text(){
    return this.commentForm.get('text')!;
  }

  get username(){
    return this.commentForm.get('username')!;
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
    
    data.momentId= Number(this.moment!.id)

    try {
      await this.commentService.createComment(data).subscribe((comment) => this.moment?.comments?.push(comment.data));

    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
    }
    

    this.messagesService.add("Comentário adicionado!")

    this.commentForm.reset();

    formDirective.resetForm();
  }
}
