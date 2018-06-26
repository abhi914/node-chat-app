let expect = require('expect');
let {generateMessage } = require('./message');

describe('Generate message', () => {
    it('it should generate correct message object', () => {
        let from = 'jen';
        let text = 'some message';
        let message = generateMessage(from,text);

        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({
            from,
            text,
        });

        

    });
})