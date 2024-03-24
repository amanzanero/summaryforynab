export interface Sender {
  send(email: string, message: string): Promise<void>;
}
