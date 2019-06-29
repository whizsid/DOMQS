//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';
// import * as vscode from 'vscode';
import * as myExtension from '../extension';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// import * as vscode from 'vscode';
// import * as myExtension from '../extension';

// Defines a Mocha test suite to group tests of similar kind together
suite("Extension Tests", function () {

    // Defines a Mocha unit test
    test("Testing make position", function() {
        
        const position = myExtension.makePosition('<div> \r <span>kjmkjmk</span> \r </div>',8);

        assert.equal(1,position.line);
        assert.equal(1,position.character);

    });

    test("Testing make range",function(){
        const range = myExtension.makeRange('<div> \r <span>kjmkjmk</span> \n </div>',{start:8,end:33});

        assert.equal(1,range.start.line);
        assert.equal(1,range.start.character);
        assert.equal(2,range.end.line);
        assert.equal(3,range.end.character);
    });
});