import { Injectable } from '@angular/core';

export class TopicListItem {
    constructor(public id: string, public author_id: string,public title: string,  public content: string) { }
}