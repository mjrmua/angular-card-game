import { FlipMessage } from './messages/FlipMessage';
import { Subject } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { MessageService } from './message.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { async, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Message } from './messages/Message';

describe('Message Store', () => {
    const serverStore = new Subject<Message[]>();

    beforeEach(() => {

    });

    it('loads messages for a game id', () => {
        const firebase = jasmine.createSpyObj('AngularFireDatabase', ['list']);
        firebase.list.and.returnValue(serverStore);
        new MessageService(firebase)
            .loadMessageStore('id');
        expect(firebase.list).toHaveBeenCalledWith('/messageLog/id');
    });

    it('publishes messages in MessageStream', fakeAsync(() => {
        const firebase = jasmine.createSpyObj('AngularFireDatabase', ['list']);
        firebase.list.and.returnValue(serverStore);
        const serverMessages = [ new FlipMessage('1'), new FlipMessage('2')];
        const receivedMessages = [];

        new MessageService(firebase)
                .loadMessageStore('id')
                .messageStream
                .subscribe(v => receivedMessages.push(v));
        serverStore.next(serverMessages);
        tick();
        expect(receivedMessages).toEqual(serverMessages);
    }));








});
