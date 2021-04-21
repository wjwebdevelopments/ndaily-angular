import { Component, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { PostsService } from '../posts.service';

import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit{

  post: Post;
  imagePreview: string;
  isLoading: boolean = false;
  private mode: string = 'create';
  private postId: string;

  PostForm: FormGroup;

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    // REVIEW: PostForm instance
    this.PostForm = new FormGroup({
      title: new FormControl(null, { validators: [ Validators.required, Validators.min(3) ] }),
      content: new FormControl(null, { validators: [ Validators.required ] }),
      image: new FormControl(null, { validators: [ Validators.required ], asyncValidators: [mimeType] })
    });

    this.route.paramMap
      .subscribe((paramMap: ParamMap) => {
         if (paramMap.has('postId')) {
           this.mode = 'edit';
           this.postId = paramMap.get('postId') || '';

           // Spinner on
           this.isLoading = true;
           this.postsService.getPost(this.postId)
            .subscribe(postData => {

              // Spinner off
              this.isLoading = false;
              this.post = { id: postData._id, title: postData.title, content: postData.content, image: '' }

              // Set PostForm values
              this.PostForm.setValue({
                title: postData.title,
                content: postData.content
              });

            });
         }else {
           this.mode = 'create',
           this.postId = '';
         }
      });
  }

  onSavePost(): void {

    // REVIEW: Form Validator, Not empty
    if ( this.PostForm.invalid ) return;

    // Spinner on
    this.isLoading = true;

    if( this.mode === 'create' ) {
      this.postsService.addPost(
        this.PostForm.value.title,
        this.PostForm.value.content,
        this.PostForm.value.image
      );
    }else {
      this.postsService.updatePost(
        this.postId,
        this.PostForm.value.title,
        this.PostForm.value.content
      );
    }

    this.PostForm.reset();
  }

  onImagePicker(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (files) {
      const file = files[0];
      this.PostForm.patchValue({
        image: file
      });
      this.PostForm.get('image')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        console.log(reader);
      };
      reader.readAsDataURL(file);
    }
  }
}
