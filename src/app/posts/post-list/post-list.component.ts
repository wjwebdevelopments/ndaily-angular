import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import {Post} from '../post.model';

import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy{

  @Input() posts: Post[] = [];
  public isLoading: boolean = false;
  private postsSub: Subscription;

  constructor( public postsService: PostsService ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts();
    this.postsSub = this.postsService.getPostUpdatedListener()
      .subscribe((posts: Post[]) => {
        this.isLoading = false;
        this.posts = posts;
      });
  }

  // REVIEW: Delete post
  onPostDelete(post: Post): void {
    this.postsService.deletePost(post);
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }

}
