import { Post } from './post.model';
import { Subject, Observable } from 'rxjs';

export class PostsService {

  private posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();

  getPosts(): Post[] {
    return [...this.posts];
  }

  getPostUpdatedListener(): Observable<Post[]> {
    return this.postUpdated.asObservable();
  }

  addPost({ title, content }: Post): void {
    const post = { title, content };
    this.posts.push(post);
    this.postUpdated.next([...this.posts]);
  }

}
