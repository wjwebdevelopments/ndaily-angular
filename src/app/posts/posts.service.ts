import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.model';

import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

type PostData = {
  _id: string,
  title: string,
  content: string
}

@Injectable()
export class PostsService {

  private posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();

  constructor( 
    private http: HttpClient,
    private router: Router 
  ) {}

  getPosts(): void {
    // REVIEW: Service Fetch Posts
    this.http.get<{message: string, posts: any[]}>(`${environment.apiUrl}/posts`)
      .pipe(map(postsData => {
        return postsData.posts.map(post => {
          return {
            id: post._id,
            title: post.title,
            content: post.content,
            image: post.image
          };
        });
      }))
      .subscribe(posts => {
         this.posts = posts;
         this.postUpdated.next([...this.posts]);
      });
  }

  getPostUpdatedListener(): Observable<Post[]> {
    return this.postUpdated.asObservable();
  }

  getPost(id: string) {
    // return {...this.posts.find(post => post.id === id)};
    return this.http.get<PostData>(`${environment.apiUrl}/posts/${id}`);
  }

  addPost(title: string, content: string, image: File): void {


    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);


    // REVIEW: Service Create Post
    this.http.post<{message: string, post: Post}>(`${environment.apiUrl}/posts`, postData)
      .subscribe(responseData => {

        const post: Post = {
          id: responseData.post.id,
          title: title,
          content: content,
          image: responseData.post.image
        }

        this.posts.push(post);
        this.postUpdated.next([...this.posts]);
        
        // Navigate to home here!
        this.router.navigate(['/'])
          .then(() => {
            // TODO: Show post create sweetalert here!
            //...
          });

      });
  }

  updatePost(id: string, title: string, content: string): void {
    const post: Post = { id, title, content, image: '' };
    this.http.put(`${environment.apiUrl}/posts/${id}`, post)
      .subscribe((response) => { // {message: "The post has been modified"}

          const uPosts = [...this.posts];
          const oldPostIndex = uPosts.findIndex(p => p.id === post.id);
          uPosts[oldPostIndex] = post;
          this.posts = uPosts;
          this.postUpdated.next([...this.posts]);

          // Navigate to home here!
          this.router.navigate(['/'])
            .then(() => {
              // TODO: Show updated post sweetalert here!
              //...
            });

      })
  }

  // REVIEW: Service Delete Post
  deletePost(post: Post): void {
    const { id } = post;
    this.http.delete(`${environment.apiUrl}/posts/${id}`)
      .subscribe(() => {
        const updatedPost = this.posts.filter(DBpost => DBpost.id !== post.id);
        this.posts = updatedPost;
        this.postUpdated.next([...this.posts]);
      });
  }

}
