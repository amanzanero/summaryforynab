/* eslint-disable no-unused-vars */
export interface Sender {
  send(userId: string, message: string): Promise<void>;
}
