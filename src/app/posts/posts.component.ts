import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {FormControl, FormGroup, FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent {
  title = 'app';
  posts:Array<any> = [];
  postForm:FormGroup;

  constructor(public http:HttpClient,
              private fb: FormBuilder) {
    this.postForm = this.fb.group({
      _id: new FormControl(''),
      title: new FormControl(''),
      body: new FormControl('')
    });

    this.getAllPosts();
  }

  editPost(post) {
    this.postForm.setValue({
      _id: post._id,
      title: post.properties.title,
      body: post.properties.body,
    });
  }

  reset() {
    this.postForm.reset();
    this.getAllPosts();
  }

  resetEdit() {
    this.postForm.reset();
  }

  addPost() {
    if (this.postForm.value && this.postForm.value._id) {
      this.http.put(`/api/posts/${this.postForm.value._id}`, this.postForm.value )
        .subscribe((res) => this.reset())
    } else {
      this.http.post('/api/posts/new', this.postForm.value)
        .subscribe((res) => this.reset())
    }
  }

  deletePost(postId) {
    if (!postId) return;

    this.http.delete(`/api/posts/${postId}`)
      .subscribe((res) => this.reset())
  }

  getAllPosts() {
    return this.http.get('/api/posts')
      .subscribe((res) => {
        this.posts = res && Array.isArray(res) && res || [];
      })
  }
}
