import { NavTestPage } from './app.po';

describe('nav-test App', () => {
  let page: NavTestPage;

  beforeEach(() => {
    page = new NavTestPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
