export interface Sender {
  send(userId: string, message: string): Promise<void>;
}
