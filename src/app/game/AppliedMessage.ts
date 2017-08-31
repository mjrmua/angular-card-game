import { Message } from './messages/Message';

export class AppliedMessage {
    constructor(
        public index: number,
        public message: Message,
        public successful: boolean,
        public errorMessage: string) {
    }
}
