export class MockEmailManager {
  sendLoginCode = jasmine.createSpy('sendLoginCode');
  sendSignupNotification = jasmine.createSpy('sendSignupNotification');
  sendDataBackup = jasmine.createSpy('sendDataBackup');
}
