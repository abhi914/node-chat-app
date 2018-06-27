let expect = require('expect');
let {generateMessage,generateLocationMessage } = require('./message');

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
});


describe('Generate Location Message', () => {
    it('should generate correct location object', () => {

        let from = 'abhi';
        let longitude = 75.123123129312;
        let latitude = -42.454353453453;
        const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
        const message = generateLocationMessage(from,latitude,longitude);

        console.log(message);

        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({from,url});
     


    })

});