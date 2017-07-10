import { NgDemo01Page } from './app.po';

describe('ng-demo01 App', function() {
  let page: NgDemo01Page;

  beforeEach(() => {
    page = new NgDemo01Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
