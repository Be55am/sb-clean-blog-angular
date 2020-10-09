import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigService } from '@common/services';
import { Post } from '@modules/blog/models';
import {
    CreatePostPayload,
    ResultsPost,
    UpdatePostPayload,
} from '@start-bootstrap/sb-clean-blog-shared-types';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class BlogService {
    constructor(
        private http: HttpClient,
        private configService: ConfigService,
        private router: Router
    ) {}

    getPosts$(): Observable<Post[]> {
        return this.http
            .get<ResultsPost[]>(`${this.configService.config.sbCleanBlogNodeURL}/dev/posts`)
            .pipe(
                map(posts =>
                    (posts as Post[]).map(post => {
                        return post;
                    })
                )
            );
    }

    getPost$(postSlug: string): Observable<Post | null> {
        const params = new HttpParams().set('findBy', 'slug');
        return this.http.get<Post>(
            `${this.configService.config.sbCleanBlogNodeURL}/dev/posts/${postSlug}`,
            {
                params,
            }
        );
    }

    createPost$(payload: CreatePostPayload): Observable<Post | Error> {
        let slug = payload.heading;
        slug = slug.replace(/\s+/g, '-');
        slug = slug.replace(/[^a-zA-Z0-9]/g, '');
        payload.slug = slug;
        payload.meta = new Date() + '';
        console.log(JSON.stringify(payload));
        console.log('slug :' + slug);
        return this.http
            .post<ResultsPost>(`${this.configService.config.sbCleanBlogNodeURL}/dev/posts`, payload)
            .pipe(
                tap(response => this.router.navigate([`/${response.slug}`])),
                map(post => post as Post)
            );
    }

    updatePost$(post: Post, payload: UpdatePostPayload): Observable<undefined | Error> {
        return this.http
            .put<undefined>(
                `${this.configService.config.sbCleanBlogNodeURL}/dev/posts/${post.id}`,
                payload
            )
            .pipe(tap(response => this.router.navigate([`/${post.slug}`])));
    }

    deletePost$(id: UUID): Observable<undefined | Error> {
        return this.http
            .delete<undefined>(
                `${this.configService.config.sbCleanBlogNodeURL}/dev/posts/${id}`
            )
            .pipe(tap(response => this.router.navigate([`/`])));
    }
}
