import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {FormControl, FormGroup, FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
  @Input() postId: number;
  @Output() onDelete = new EventEmitter<any>();
  comments: Array<any> = [];
  commentForm:FormGroup;

  constructor(public http:HttpClient,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.commentForm = this.fb.group({
      _id: new FormControl(''),
      text: new FormControl('')
    });

    this.postId && this.getComments();
  }

  reset() {
    this.commentForm.reset();
    this.getComments();
  }

  resetEdit() {
    this.commentForm.reset();
  }

  edit(comment) {
    this.commentForm.setValue({
      _id: comment._id,
      text: comment.properties.text
    });
  }

  delete(commentId) {
    this.http.delete(`/api/comments/${commentId}`)
      .subscribe((res) => {
        this.getComments();
        this.resetEdit();
        this.onDelete.emit(true);
      })
  }

  addComment() {
    if (this.commentForm.value && this.commentForm.value._id) {
      this.http.put(`/api/comments/${this.commentForm.value._id}`, this.commentForm.value )
        .subscribe((res) => this.reset())
    } else {
      this.http.post(`/api/posts/${this.postId}/comments/new`, this.commentForm.value)
        .subscribe((res) => this.reset())
    }
  }

  getComments() {
    this.http.get(`/api/posts/${this.postId}/comments`)
      .subscribe((res) => {
        this.comments = res && Array.isArray(res) && res || [];
      })
  }

}
