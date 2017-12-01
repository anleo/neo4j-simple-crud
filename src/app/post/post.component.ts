import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router, ParamMap} from "@angular/router";
import { HttpClient } from '@angular/common/http';
import {FormControl, FormGroup, FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  post;
  postForm:FormGroup;
  postId;
  editMode = false;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.postForm = this.fb.group({
      _id: new FormControl(''),
      title: new FormControl(''),
      body: new FormControl('')
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.postId = params.get('postId');
      this.loadPost(this.postId);
    });
  }

  loadPost(postId) {
    this.http.get(`/api/posts/${postId}`)
      .subscribe((res) => {
        this.post = res;
        this.setPostEdit(this.post);
      });
  }

  setPostEdit(post) {
    this.postForm.setValue({
      _id: post._id,
      title: post.properties.title,
      body: post.properties.body,
    });
  }

  toggleEdit() {
    this.editMode = !this.editMode;
  }

  updatePost() {
    this.loading = true;
    this.http.put(`/api/posts/${this.postId}`, this.postForm.value )
      .subscribe((res) => {
        this.loadPost(this.postId);
        this.toggleEdit();
        this.loading = false;
      })
  }

  back() {
    this.router.navigateByUrl('./..')
  }

  onCommentDelete(event) {
    if (event) {
      this.editMode = false;
      this.setPostEdit(this.post);
    }
  }

  deletePost() {
    this.http.delete(`/api/posts/${this.postId}`)
      .subscribe((res) => this.back())
  }

}
