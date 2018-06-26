//always import contract
var Marketplace = artifacts.require("./Marketplace.sol");

//contract that we'll be testing
//will need accounts to transact, will know what accounts are
contract("Marketplace", function(accounts){ 
    
    var articleName = "test_article";
    var articleDescription = "this is a test";
    var articlePrice = web3.toWei(10, "ether");



    //start the first test

    //in this example we haven't used accounts yet
    //state what it is that you want to test, it - moca framework (testing framework for javascript)
    it("should have an articleCounter equal to zero in the beginning", function(){
        //firstly need an instance of the contract, ".then is a promise" waits for the deployed function to finish first
        return Marketplace.deployed().then(function(instance){
            return instance.getNumberOfArticles(); //returns articles we have right now
        }).then(function(articleNumber){ //receive artilce number
            //check that this number is equal to zero, if not return the statement (check condition)
            // assertion function from the chai suite
            assert.equal(articleNumber, 0, "initial number not equal to zero")
        });
    });


    //testing if article count has increased
    it("it should have one article for sale", function(){ //function will always be empty for int
        var MarketplaceInstance;
        return Marketplace.deployed().then(function(instance){
            MarketplaceInstance = instance;
            return MarketplaceInstance.sellArticle( 
                articleName, 
                articleDescription, 
                articlePrice,
                //provide the function with gas
                {'from':accounts[0]}
            );
        }).then(function(receipt){ //testing that the event was triggered
        }).then(function(){
            return MarketplaceInstance.getNumberOfArticles();
        }).then(function(articleCounter){
            assert.equal(articleCounter, 1, "articleCounter has not increased")
        }).then(function(){
            return MarketplaceInstance.articles(1);
        }).then(function(article){
            assert.equal(article[0], 1, "id is not 1") //id
            assert.equal(article[1], articlePrice, "price is not 10 ether") //price
            assert.equal(article[2], accounts[0], "seller is not correct") //seller
            assert.equal(article[3], 0x0, "buyer is not unknown") //buyer
            assert.equal(article[4], articleName, "articleName is not correct") //name
            assert.equal(article[5], articleDescription, "articleDescription is not correct")//description
        });
    });
});