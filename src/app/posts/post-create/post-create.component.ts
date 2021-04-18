import { Component } from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';

import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent {

  constructor( public postsService: PostsService ) {}

  onSavePost(form: NgForm): void {
    // if (form.invalid) return;
    const post: Post = {
      title: form.value.title,
      content: form.value.content
    };
    this.postsService.addPost(post);
    form.resetForm();
  }
}
