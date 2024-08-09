import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { DataBackup } from 'pk-common';
import { NodeMailerManager, TransportCreatorFn } from '../../src/utils/node-mailer-manager';

describe('NodeMailerManager', () => {
  let createTransportFn: jest.Mock;
  let transporterSpy: { sendMail: jest.Mock };
  let emailManager: NodeMailerManager;

  beforeEach(() => {
    process.env.NOTIFICATION_EMAIL = 'test@test.com';
    createTransportFn = jest.fn();
    transporterSpy = { sendMail: jest.fn() };
    createTransportFn.mockReturnValue(transporterSpy);
    emailManager = new NodeMailerManager(createTransportFn as unknown as TransportCreatorFn);
  });

  it('should call createTransport function when sending a login code email', () => {
    emailManager.sendLoginCode('test@test.com', '123123', 'token');
    expect(createTransportFn).toHaveBeenCalled();
    expect(transporterSpy.sendMail).toHaveBeenCalled();
  });

  it('should call createTransport function when sending a notification email', () => {
    emailManager.sendSignupNotification('test@test.com');
    expect(createTransportFn).toHaveBeenCalled();
    expect(transporterSpy.sendMail).toHaveBeenCalled();
  });

  it('should call createTransport function when sending a data backup email', () => {
    emailManager.sendDataBackup('name', 'test@test.com', {} as DataBackup);
    expect(createTransportFn).toHaveBeenCalled();
    expect(transporterSpy.sendMail).toHaveBeenCalled();
  });
});
