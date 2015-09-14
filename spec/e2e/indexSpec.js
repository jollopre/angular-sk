describe('Index view spec', function() {
  it('should have a title', function() {
    browser.get('index.html');

    expect(browser.getTitle()).toEqual('AngularJS app');
  });
});