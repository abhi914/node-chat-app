const expect = require('expect');
const {isRealString} = require('./validation');


describe('real string', () => {


    it(`it should reject non string values`,() => {

        let str = 98;
        let res = isRealString(str);

        expect(res)
        .toBe(false);

    });

    it('should reject string with only spaces', () =>{
        let str = "   ";
        let res = isRealString(str);
        
        expect(res)
        .toBe(false)

    });

    it(`should allow string with non space charaters`, () => {
        
        let str = "adam" ;
        let res = isRealString(str);

        expect(res).toBe(true);

    });
});