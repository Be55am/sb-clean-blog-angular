import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {faThumbsUp} from '@fortawesome/free-regular-svg-icons';
import {faGlasses} from '@fortawesome/free-solid-svg-icons';
import {AuthUtilsService} from '@modules/auth/services';
import {Post} from '@modules/blog/models';
import {BlogService} from '@modules/blog/services';
import {Observable, Subscription} from 'rxjs';
import {distinctUntilChanged, switchMap, tap} from 'rxjs/operators';


@Component({
    selector: 'sb-post',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './post.component.html',
    styleUrls: ['post.component.scss'],
})
export class PostComponent implements OnInit, OnDestroy {
    static id = 'PostComponent';

    subscription: Subscription = new Subscription();
    isLoggedIn = false;
    post$!: Observable<Post | null>;
    post!: string;
    faCoffee = faGlasses;
    thumbsUp = faThumbsUp;


    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private blogService: BlogService,
        private authUtilsService: AuthUtilsService
    ) {
    }

    ngOnInit() {
        this.post$ = this.route.paramMap.pipe(distinctUntilChanged()).pipe(
            tap((params: ParamMap) => (this.post = params.get('post') as string)),
            distinctUntilChanged(),
            switchMap((params: ParamMap) => this.blogService.getPost$(params.get('post') as string))
        );
        this.subscription.add(
            this.authUtilsService.isLoggedIn$().subscribe(isLoggedIn => {
                this.isLoggedIn = isLoggedIn;
            })
        );
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    editPost() {
        this.router.navigateByUrl(`/edit/${this.post}`);
    }
}
